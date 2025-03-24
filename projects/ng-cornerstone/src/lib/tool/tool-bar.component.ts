import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { Subject } from 'rxjs';
import { TOOL_CONFIG_MAP } from './tool.config';
import { addTool, Enums as csToolsEnums, state, Types as csToolTypes, ToolGroupManager } from '@cornerstonejs/tools';
import { ToolConfig, ToolEnum } from './tool.types';
import { CornerstoneService } from '../core';

@Component({
  selector: 'nc-tool-bar',
  exportAs: 'ncToolBar',
  templateUrl: './tool-bar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToolBarComponent implements AfterViewInit, OnChanges, OnDestroy, OnInit {
  private destroy$ = new Subject<void>();

  @Input()
  toolGroupId!: string;

  @Input()
  toolList: ToolEnum[] = [];

  @Input()
  activeViewportId: string | undefined;

  @Output() toolbarInit = new EventEmitter<string>();
  @Output() toolbarDestroy = new EventEmitter<string>();

  private toolGroup!: csToolTypes.IToolGroup;

  segmentationRepresentationUIDs: string[] | undefined;

  toolConfigList: ToolConfig[] = [];
  cameraList: ToolConfig[] = [];
  currentTool?: ToolConfig;

  constructor(private csService: CornerstoneService, private cdr: ChangeDetectorRef) {}

  ngOnChanges(changes: SimpleChanges): void {
    const { toolList, activeViewportId } = changes;
    if (toolList && !toolList.isFirstChange()) {
      this.updateToolList();
    }
    if (activeViewportId && !activeViewportId.isFirstChange()) {
      this.updateActiveViewport(this.activeViewportId);
    }
  }

  ngOnInit(): void {
    console.debug('Toolbar register:', this.toolGroupId);
    this.toolGroup = ToolGroupManager.createToolGroup(this.toolGroupId)!;
    this.updateToolList();
  }

  ngAfterViewInit(): void {
    this.toolbarInit.emit();
    this.csService.setToolGroup(this.toolGroup);
  }

  get renderingEngineId() {
    return this.csService.getRenderingEngineId();
  }

  get renderingEngine() {
    return this.csService.getRenderingEngine();
  }

  registerViewport(viewportId: string) {
    console.debug('Toolbar register viewport:', viewportId);
    this.toolGroup.addViewport(viewportId, this.renderingEngineId);
  }

  unregisterViewport(viewportId: string) {
    console.debug('Toolbar unregister viewport:', viewportId);
    this.toolGroup.removeViewports(this.renderingEngineId, viewportId);
  }

  updateToolList() {
    if (!this.toolGroup) {
      return;
    }
    const toolConfigList: ToolConfig[] = [];
    const cameraList: ToolConfig[] = [];
    this.toolList.forEach((toolEnum) => {
      const config = TOOL_CONFIG_MAP[toolEnum]!;
      config.disabled = false;
      if (config.tool) {
        toolConfigList.push(config);
        const toolName = config.tool.toolName;
        const toolAlreadyAdded = state.tools[toolName] !== undefined;
        if (!toolAlreadyAdded) {
          addTool(config.tool);
        }
        if (!this.toolGroup.hasTool(config.name)) {
          this.toolGroup.addTool(config.name);
        }
      } else if (config.callback) {
        cameraList.push(config);
      }
    });
    for (let i = 0; i < toolConfigList.length; i++) {
      const toolConfig = toolConfigList[i];
      if (toolConfig.name) {
        this.toolGroup.setToolPassive(toolConfig.name);
      }
    }
    this.toolConfigList = toolConfigList;
    this.cameraList = cameraList;
  }

  updateActiveViewport(inputActiveViewportId?: string) {
    const activeViewportId = inputActiveViewportId;
    if (!activeViewportId) {
      return;
    }

    // 保存旧的activeViewportId
    const previousViewportId = this.activeViewportId;

    // 更新当前的activeViewportId
    this.activeViewportId = activeViewportId;

    const viewport = this.renderingEngine.getViewport(this.activeViewportId!);
    if (viewport) {
      const viewportType = viewport.type;
      this.toolConfigList.forEach((toolConfig) => {
        if (toolConfig.types.includes(viewportType)) {
          toolConfig.disabled = false;
        } else {
          toolConfig.disabled = true;
        }
      });
      this.cameraList.map((cameraConfig) => {
        if (cameraConfig.types.includes(viewportType)) {
          cameraConfig.disabled = false;
        } else {
          cameraConfig.disabled = true;
        }
      });

      // 确保新的viewport已添加到toolGroup中
      if (!this.toolGroup.getViewportIds().includes(this.activeViewportId)) {
        this.registerViewport(this.activeViewportId);
      }

      // 重新激活当前工具，确保它能在新的viewport上操作
      if (previousViewportId !== this.activeViewportId && this.currentTool) {
        // 先移除其他绑定，以确保工具干净地应用于新viewport
        const toolNames = this.toolConfigList.map((config) => config.name);
        toolNames.forEach((name) => {
          if (name !== this.currentTool?.name) {
            this.toolGroup.setToolPassive(name);
          }
        });

        // 重新激活当前工具
        this.toolGroup.setToolActive(this.currentTool.name, {
          bindings: [{ mouseButton: csToolsEnums.MouseBindings.Primary }],
        });

        // 确保工具应用于当前viewport
        this.toolGroup.setViewportsCursorByToolName(this.currentTool.name);
      }

      this.cdr.detectChanges();
    }
  }

  activeTool(names: any[]) {
    if (!names || names.length === 0) {
      return;
    }
    const pressedTool = this.toolConfigList.find((toolConfig) => toolConfig.name === names[0]);
    if (!pressedTool) {
      return;
    }
    if (pressedTool.tool) {
      if (this.currentTool) {
        this.toolGroup.setToolPassive(this.currentTool.name);
      }
      this.currentTool = pressedTool;
      this.toolGroup.setToolActive(pressedTool.name, {
        bindings: [{ mouseButton: csToolsEnums.MouseBindings.Primary }],
      });
      this.toolGroup.setViewportsCursorByToolName(pressedTool.name);
    }
  }

  changeCamera(name: string) {
    if (!name) {
      return;
    }
    const cameraTool = this.cameraList.find((toolConfig) => toolConfig.name === name);
    if (cameraTool?.callback) {
      cameraTool.callback(this.renderingEngineId, this.activeViewportId!, cameraTool.options);
    }
  }

  ngOnDestroy(): void {
    console.debug('Toolbar destroy: ', this.toolGroupId);
    this.toolbarDestroy.emit(this.toolGroupId);
    ToolGroupManager.destroyToolGroup(this.toolGroupId);
    this.destroy$.next();
    this.destroy$.complete();
  }
}
