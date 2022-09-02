import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  HostListener,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { Subject } from 'rxjs';
import { TOOL_CONFIG_MAP, ToolConfig, ToolEnum } from './tool.config';
import {
  addTool,
  Enums as ToolsEnums,
  ToolGroupManager,
} from '@cornerstonejs/tools';
import { IToolGroup } from '@cornerstonejs/tools/dist/esm/types';

@Component({
  selector: 'tool-group',
  exportAs: 'appToolGroup',
  templateUrl: './tool-group.component.html',
  styleUrls: ['./tool-group.component.scss'],
})
export class ToolGroupComponent implements OnInit {
  private destroy$ = new Subject<void>();

  @Input()
  toolList: ToolEnum[] = [];

  @Input()
  toolGroupId: string = 'MY_TOOLGROUP_ID';

  @Input()
  viewportId: string = '';
  @Input()
  renderEngineId: string = '';

  public toolGroup!: IToolGroup;
  toolConfigList: ToolConfig[] = [];

  activeTool?: ToolConfig;

  constructor(private cd: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.toolGroup = ToolGroupManager.createToolGroup(this.toolGroupId)!;
    // @ts-ignore
    this.toolConfigList = this.toolList
      .map((tool) => {
        return TOOL_CONFIG_MAP[tool];
      })
      .filter((value) => {
        return value !== undefined;
      });
    this.toolConfigList.forEach((value) => {
      if (value.tool) {
        addTool(value.tool);
        this.toolGroup.addTool(value.name);
      }
    });
  }

  toolActive(toolConfig: ToolConfig) {
    if (toolConfig.tool) {
      if (this.activeTool) {
        this.toolGroup.setToolPassive(this.activeTool.name);
      }
      // @ts-ignore
      this.activeTool = toolConfig;
      this.toolGroup.setToolActive(this.activeTool?.name!, {
        bindings: [{ mouseButton: ToolsEnums.MouseBindings.Primary }],
      });
    } else if (toolConfig.callback) {
      toolConfig?.callback(this.renderEngineId, this.viewportId);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
