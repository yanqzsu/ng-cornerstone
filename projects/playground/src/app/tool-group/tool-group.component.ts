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
import { ORIENTATION } from '@cornerstonejs/core/dist/esm/constants';
import { getRenderingEngine } from '@cornerstonejs/core';
import { OrientationEnum, OrientationStringList } from '../core/constants';

@Component({
  selector: 'tool-group',
  exportAs: 'appToolGroup',
  templateUrl: './tool-group.component.html',
  styleUrls: ['./tool-group.component.scss'],
})
export class ToolGroupComponent implements OnInit {
  private destroy$ = new Subject<void>();
  OrientationStringList = OrientationStringList;

  @Input()
  toolList: ToolEnum[] = [];

  @Input()
  toolGroupId: string = 'MY_TOOLGROUP_ID';

  @Input()
  viewportIds: string[] = [];
  @Input()
  focusedViewportId: string = '';

  @Input()
  renderingEngineId: string = '';

  public toolGroup!: IToolGroup;
  toolConfigList: ToolConfig[] = [];
  orientation = OrientationEnum.SAGITTAL;
  activeTool?: ToolConfig;

  constructor() {}

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
    this.viewportIds.forEach((viewportId) => {
      this.toolGroup.addViewport(viewportId, this.renderingEngineId);
    });
    if (!this.focusedViewportId) {
      this.focusedViewportId = this.viewportIds[0];
    }
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
      this.toolGroup.setViewportsCursorByToolName;
    } else if (toolConfig.callback) {
      toolConfig?.callback(this.renderingEngineId, this.focusedViewportId);
    }
  }

  changeOrientation(event: any) {
    const selectedValue = event?.target?.value;
    const renderingEngine = getRenderingEngine(this.renderingEngineId);
    const viewport = renderingEngine!.getViewport(this.focusedViewportId);

    // TODO -> Maybe we should rename sliceNormal to viewPlaneNormal everywhere?
    let viewUp;
    let viewPlaneNormal;

    switch (selectedValue) {
      case 'AXIAL':
      case 'CORONAL':
      case 'SAGITTAL':
        viewUp = ORIENTATION[selectedValue].viewUp;
        viewPlaneNormal = ORIENTATION[selectedValue].sliceNormal;
        break;
      case 'OBLIQUE':
        // Some random oblique value for this dataset
        viewUp = [-0.5962687530844388, 0.5453181550345819, -0.5891448751239446];
        viewPlaneNormal = [
          -0.5962687530844388, 0.5453181550345819, -0.5891448751239446,
        ];
        break;
      default:
        throw new Error('undefined orientation option');
    }

    // TODO -> Maybe we should have a helper for this on the viewport
    // Set the new orientation
    viewport.setCamera({ viewUp, viewPlaneNormal });
    // Reset the camera after the normal changes
    viewport.resetCamera();
    viewport.render();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
