import {
  AfterViewInit,
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
import {
  addTool,
  destroy,
  Enums as csToolsEnums,
  state,
  ToolGroupManager,
  SegmentationDisplayTool,
  segmentation,
} from '@cornerstonejs/tools';
import { IToolGroup } from '@cornerstonejs/tools/dist/esm/types';
import { ToolConfig, ToolEnum } from './tool.types';

@Component({
  selector: 'nc-tool-bar',
  exportAs: 'ncToolBar',
  templateUrl: './tool-bar.component.html',
})
export class ToolBarComponent implements OnInit, OnChanges, OnDestroy {
  private destroy$ = new Subject<void>();
  private toolGroupId = 'TOOL_GROUP_ID';
  private toolGroup!: IToolGroup;

  @Input()
  toolList: ToolEnum[] = [];
  @Input()
  renderingEngineId: string = '';
  @Input()
  activeViewportId: string | undefined;
  @Input()
  viewportIds: string[] = [];

  segmentationRepresentationUIDs: string[] | undefined;

  toolConfigList: ToolConfig[] = [];
  cameraList: ToolConfig[] = [];
  currentTool?: ToolConfig;

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    const { toolList, viewportIds } = changes;
    if (toolList && !toolList.firstChange) {
      this.updateToolList();
    }
    if (viewportIds && !viewportIds.firstChange) {
      this.updateViewport();
    }
  }

  ngOnInit(): void {
    this.toolGroup = ToolGroupManager.createToolGroup(this.toolGroupId)!;
    this.updateToolList();
    this.updateViewport();
    this.enableSegmentTool();
  }

  updateViewport() {
    if (!this.toolGroup || this.viewportIds?.length === 0) {
      return;
    }
    const oriViewportIds = this.toolGroup.getViewportIds() || [];
    const newViewportIds = this.viewportIds || [];
    let viewportChanged = false;
    oriViewportIds?.forEach((id) => {
      if (!newViewportIds.includes(id)) {
        this.toolGroup.removeViewports(this.renderingEngineId, id);
        viewportChanged = true;
      }
    });

    newViewportIds.forEach((viewportId) => {
      if (!oriViewportIds?.includes(viewportId)) {
        this.toolGroup.addViewport(viewportId, this.renderingEngineId);
        viewportChanged = true;
      }
    });
    if (viewportChanged && newViewportIds.length > 0) {
      this.activeViewportId = newViewportIds[0];
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

  updateToolList() {
    if (!this.toolGroup || this.toolList.length === 0) {
      return;
    }
    console.debug('toolGroup updateToolList');
    const toolConfigList: ToolConfig[] = [];
    const cameraList: ToolConfig[] = [];
    this.toolList.forEach((toolEnum) => {
      const config = TOOL_CONFIG_MAP[toolEnum];
      if (config) {
        if (config.tool) {
          toolConfigList.push(config);
          const toolName = config.tool.toolName;
          const toolAlreadyAdded = state.tools[toolName] !== undefined;
          if (!toolAlreadyAdded) {
            addTool(config.tool);
          }
          this.toolGroup.addTool(config.name);
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
    destroy();
    ToolGroupManager.destroyToolGroup(this.toolGroupId);
    this.destroy$.next();
    this.destroy$.complete();
  }
}
