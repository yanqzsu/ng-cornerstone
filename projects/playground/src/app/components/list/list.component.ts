import {
  Component,
  Input,
  HostBinding,
  ContentChildren,
  QueryList,
} from '@angular/core';

/**
 * List item component is a grouping component that accepts arbitrary content.
 * It should be direct child of `ni-list` component.
 */
@Component({
  selector: 'app-list-item',
  template: `<ng-content></ng-content>`,
  styleUrls: ['list-item.component.less'],
})
export class ListItemComponent {
  /**
   * Role attribute value
   */
  @Input()
  @HostBinding('attr.role')
  role = 'listitem';
}

/**
 * List is a container component that wraps `ni-list-item` component.
 *
 */
@Component({
  selector: 'app-list',
  template: `<i *ngIf="empty" app-icon="infinity-empty" class="empty-icon"></i
    ><ng-content select="app-list-item"></ng-content>`,
  styleUrls: ['./list.component.less'],
})
export class ListComponent {
  /**
   * Role attribute value
   */
  @Input()
  @HostBinding('attr.role')
  role = 'list';

  @ContentChildren(ListItemComponent)
  items: QueryList<ListItemComponent> = new QueryList<ListItemComponent>();

  @HostBinding('class.empty')
  get empty(): boolean {
    return this.items.length === 0;
  }
}
