import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Subject } from 'rxjs';
import { TOOL_CONFIG_MAP } from './tool.config';
import { addTool, destroy, Enums as ToolsEnums, init, state, ToolGroupManager } from '@cornerstonejs/tools';
import { IToolGroup } from '@cornerstonejs/tools/dist/esm/types';
import ViewportType from '@cornerstonejs/core/dist/esm/enums/ViewportType';
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
  viewportType?: ViewportType;
  @Input()
  renderingEngineId: string = '';
  @Input()
  activeViewportId!: string;

  toolConfigList: ToolConfig[] = [];
  cameraList: ToolConfig[] = [];
  currentTool?: ToolConfig;

  constructor() {
    init();
  }

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

  setViewport(viewportIds: string[]) {
    console.log('toolGroup setViewport');
    const oriViewportIds = this.toolGroup.getViewportIds();
    oriViewportIds?.forEach((id) => this.toolGroup.removeViewports(this.renderingEngineId, id));
    viewportIds?.forEach((viewportId) => this.toolGroup.addViewport(viewportId, this.renderingEngineId));
  }

  updateToolList() {
    if (!this.toolGroup || !this.viewportType || this.toolList.length === 0) {
      return;
    }
    console.log('toolGroup updateToolList');
    const toolConfigList: ToolConfig[] = [];
    const cameraList: ToolConfig[] = [];
    this.toolList.forEach((toolEnum) => {
      const config = TOOL_CONFIG_MAP[toolEnum];
      if (config && config.types.indexOf(this.viewportType!) > -1) {
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
        bindings: [{ mouseButton: ToolsEnums.MouseBindings.Primary }],
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
      cameraTool.callback(this.renderingEngineId, this.activeViewportId, cameraTool.options);
    }
  }

  ngOnDestroy(): void {
    destroy();
    ToolGroupManager.destroyToolGroup(this.toolGroupId);
    this.destroy$.next();
    this.destroy$.complete();
  }
}
