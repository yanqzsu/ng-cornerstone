import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { Subject } from 'rxjs';
import { ORIENTATION_LIST, TOOL_CONFIG_MAP } from './tool.config';
import {
  addTool,
  Enums as ToolsEnums,
  ToolGroupManager,
} from '@cornerstonejs/tools';
import { IToolGroup } from '@cornerstonejs/tools/dist/esm/types';
import { getRenderingEngine } from '@cornerstonejs/core';
import { OrientationEnum, ToolConfig, ToolEnum  } from '../core';
import ViewportType from '@cornerstonejs/core/dist/esm/enums/ViewportType';

@Component({
  selector: 'nc-tool-bar',
  exportAs: 'ncToolBar',
  templateUrl: './tool-bar.component.html',
  styleUrls: ['./tool-bar.component.scss'],
})
export class ToolBarComponent implements OnInit, OnChanges, OnDestroy {
  private destroy$ = new Subject<void>();
  ORIENTATION_LIST = ORIENTATION_LIST;

  @Input()
  toolList: ToolEnum[] = [];
  @Input()
  toolGroupId: string = 'MY_TOOLGROUP_ID';
  @Input()
  viewportIds: string[] = [];
  @Input()
  viewportType: ViewportType = ViewportType.ORTHOGRAPHIC;
  @Input()
  focusedViewportId: string = '';
  @Input()
  renderingEngineId: string = '';

  public toolGroup!: IToolGroup;
  toolConfigList: ToolConfig[] = [];
  orientationList: ToolConfig[] = [];
  orientation = OrientationEnum.SAGITTAL;
  activeTool?: ToolConfig;

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    const { viewportType } = changes;
    if (viewportType) {
      // @ts-ignore
      this.toolConfigList = this.toolList
        .map((tool) => {
          return TOOL_CONFIG_MAP[tool];
        })
        .filter(
          (value) =>
            value !== undefined &&
            value.types.findIndex((type) => type === this.viewportType) > -1,
        );
    }
  }

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
    this.orientationList = Object.keys(ORIENTATION_LIST)
      .map((tool) => {
        return ORIENTATION_LIST[tool];
      })
      .filter(
        (value) =>
          value !== undefined &&
          value.types.findIndex((type) => type === this.viewportType) > -1,
      );
    console.log(this.orientationList);
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
        viewUp = OrientationEnum[selectedValue].viewUp;
        viewPlaneNormal = OrientationEnum[selectedValue].sliceNormal;
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
