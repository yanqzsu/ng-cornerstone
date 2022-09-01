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

  public toolGroup!: IToolGroup;
  toolConfigList: ToolConfig[] = [];

  activeToolName?: string;

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
      addTool(value.tool);
      this.toolGroup.addTool(value.name);
      // this.toolGroup.setToolActive(value.toolName, {
      //   bindings: [{ mouseButton: ToolsEnums.MouseBindings.Primary }],
      // });
    });
  }

  toolActive(toolName: string) {
    if (this.activeToolName) {
      this.toolGroup.setToolPassive(this.activeToolName);
    }
    // @ts-ignore
    this.activeToolName = toolName;
    this.toolGroup.setToolActive(this.activeToolName!, {
      bindings: [{ mouseButton: ToolsEnums.MouseBindings.Primary }],
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
