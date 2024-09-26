import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { Subject } from 'rxjs';
import { TOOL_CONFIG_MAP } from './tool.config';
import { addTool, Enums as csToolsEnums, segmentation, SegmentationDisplayTool, state } from '@cornerstonejs/tools';
import { ToolConfig, ToolEnum } from './tool.types';
import { CornerstoneService } from '../core';

@Component({
  selector: 'nc-tool-bar',
  exportAs: 'ncToolBar',
  templateUrl: './tool-bar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToolBarComponent implements OnInit, OnChanges, OnDestroy {
  private destroy$ = new Subject<void>();

  @Input()
  toolList: ToolEnum[] = [];

  @Input()
  activeViewportId: string | undefined;

  segmentationRepresentationUIDs: string[] | undefined;

  toolConfigList: ToolConfig[] = [];
  cameraList: ToolConfig[] = [];
  currentTool?: ToolConfig;

  constructor(private csService: CornerstoneService, private cdr: ChangeDetectorRef) {}

  get toolGroup() {
    return this.csService.getToolGroup();
  }
  get toolGroupId() {
    return this.csService.getToolGroupId();
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { toolList, activeViewportId } = changes;
    if (toolList) {
      this.updateToolList();
    }
    if (activeViewportId && !activeViewportId.firstChange) {
      this.updateActiveViewport(this.activeViewportId);
    }
  }

  ngOnInit(): void {
    this.enableSegmentTool();
  }

  get renderingEngineId() {
    return this.csService.getRenderingEngineId();
  }

  get renderingEngine() {
    return this.csService.getRenderingEngine();
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
    console.debug('toolGroup updateToolList');
  }

  updateActiveViewport(inputActiveViewportId?: string) {
    const activeViewportId = inputActiveViewportId;
    if (!activeViewportId) {
      return;
    }
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
      this.cdr.detectChanges();
    }
  }

  enableSegmentTool() {
    const toolAlreadyAdded = state.tools[SegmentationDisplayTool.toolName] !== undefined;
    if (!toolAlreadyAdded) {
      addTool(SegmentationDisplayTool);
    }
    if (!this.toolGroup.hasTool(SegmentationDisplayTool.toolName)) {
      this.toolGroup.addTool(SegmentationDisplayTool.toolName);
      this.toolGroup.setToolEnabled(SegmentationDisplayTool.toolName);
    }
  }

  async addSegmentationRepresentations(
    segmentationId: string,
    segRepresentations: csToolsEnums.SegmentationRepresentations,
  ) {
    this.segmentationRepresentationUIDs = await segmentation.addSegmentationRepresentations(this.toolGroupId, [
      {
        segmentationId,
        type: segRepresentations,
        options: {
          // TODO: Seg worker import failed
          // polySeg: {
          //   enabled: true,
          // },
        },
      },
    ]);
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
    this.destroy$.next();
    this.destroy$.complete();
  }
}
