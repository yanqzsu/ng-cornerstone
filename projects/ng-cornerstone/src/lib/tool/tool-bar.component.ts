import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { Subject } from 'rxjs';
import { TOOL_CONFIG_MAP } from './tool.config';
import {
  addTool,
  Enums as ToolsEnums,
  ToolGroupManager,
} from '@cornerstonejs/tools';
import { IToolGroup } from '@cornerstonejs/tools/dist/esm/types';
import { ToolConfig, ToolEnum } from '../core';
import ViewportType from '@cornerstonejs/core/dist/esm/enums/ViewportType';

@Component({
  selector: 'nc-tool-bar',
  exportAs: 'ncToolBar',
  templateUrl: './tool-bar.component.html',
  styleUrls: ['./tool-bar.component.scss'],
})
export class ToolBarComponent implements OnInit, OnChanges, OnDestroy {
  private destroy$ = new Subject<void>();
  private toolGroupId = 'TOOL_GROUP_ID';
  private toolGroup!: IToolGroup;
  registerToolSet = new Set<ToolEnum>();

  @Input()
  toolList: ToolEnum[] = [];
  @Input()
  viewportType: ViewportType = ViewportType.ORTHOGRAPHIC;
  @Input()
  viewportId: string = '';
  @Input()
  renderingEngineId: string = '';

  toolConfigList: ToolConfig[] = [];
  cameraList: ToolConfig[] = [];
  currentTool?: ToolConfig;

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    const { viewportType, toolList } = changes;
    if (viewportType || toolList) {
      this.updateToolList();
    }
  }

  ngOnInit(): void {
    this.toolGroup = ToolGroupManager.createToolGroup(this.toolGroupId)!;
    this.updateToolList();
  }

  updateViewport() {
    // this.initToolGroup();
    this.toolGroup.addViewport(this.viewportId, this.renderingEngineId);
  }

  updateToolList() {
    if (!this.toolGroup) {
      return;
    }
    const toolConfigList: ToolConfig[] = [];
    const cameraList: ToolConfig[] = [];
    this.toolList.forEach((toolEnum) => {
      const config = TOOL_CONFIG_MAP[toolEnum];
      if (config && config.types.indexOf(this.viewportType) > -1) {
        if (!this.registerToolSet.has(toolEnum)) {
          if (config.tool) {
            addTool(config.tool);
            this.toolGroup.addTool(config.name);
          }
          this.registerToolSet.add(toolEnum);
        }
        if (config.tool) {
          toolConfigList.push(config);
        } else if (config.callback) {
          cameraList.push(config);
        }
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

  activeTool(names: any[]) {
    if (!names || names.length === 0) {
      return;
    }
    const pressedTool = this.toolConfigList.find(
      (toolConfig) => toolConfig.name === names[0],
    );
    if (!pressedTool) {
      return;
    }
    if (pressedTool.tool) {
      if (this.currentTool) {
        this.toolGroup.setToolPassive(this.currentTool.name);
      }
      this.currentTool = pressedTool;
      this.toolGroup.setToolActive(pressedTool.name, {
        bindings: [{ mouseButton: ToolsEnums.MouseBindings.Primary }],
      });
      this.toolGroup.setViewportsCursorByToolName(pressedTool.name);
    }
  }

  changeCamera(name: string) {
    if (!name) {
      return;
    }
    const cameraTool = this.cameraList.find(
      (toolConfig) => toolConfig.name === name,
    );
    if (cameraTool?.callback) {
      cameraTool.callback(
        this.renderingEngineId,
        this.viewportId,
        cameraTool.options,
      );
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
