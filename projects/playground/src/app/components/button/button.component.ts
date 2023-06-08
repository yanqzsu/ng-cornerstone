import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  HostListener,
  Input,
  OnDestroy,
  Output,
} from '@angular/core';
import { InputBoolean } from '../../core/util/convert';
import { Observable, Subject } from 'rxjs';
import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';

export type ButtonType = 'primary' | 'default';
export type ButtonContent = 'icon-text' | 'icon' | 'text' | 'default';
export type ButtonShape = 'circle' | 'round' | 'default';
export type ButtonSize = 'large' | 'default' | 'small';
export interface ButtonToggleChange {
  source: ButtonComponent;
  pressed: boolean;
}

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'button[app-button], a[app-button]',
  exportAs: 'appButton',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  // eslint-disable-next-line @angular-eslint/no-host-metadata-property
  host: {
    class: 'app-btn',
    '[class.btn-type-primary]': `type === 'primary'`,
    '[class.btn-type-default]': `type === 'default'`,
    '[class.btn-content-icon-text]': `content === 'icon-text'`,
    '[class.btn-content-icon]': `content === 'icon'`,
    '[class.btn-content-text]': `content === 'text'`,
    '[class.btn-shape-round]': `shape === 'round'`,
    '[class.btn-shape-circle]': `shape === 'circle'`,
    '[class.btn-size-lg]': `size === 'large'`,
    '[class.btn-size-sm]': `size === 'small'`,
    '[attr.tabindex]': 'disabled ? -1 : (tabIndex === null ? null : tabIndex)',
    '[attr.disabled]': 'disabled || null',
  },
})
export class ButtonComponent implements OnDestroy {
  @Input() @InputBoolean() disabled = false;
  @Input() tabIndex: number | string | null = null;
  @Input() type: ButtonType = 'default';
  @Input() shape: ButtonShape = 'default';
  @Input() content: ButtonContent = 'default';
  @Input() size: ButtonSize = 'default';
  @Input() @InputBoolean() isToggle = false;
  @Input() icon: string | null = null;
  @Input() text: string | null = null;
  @Input() value: any;

  @HostListener('click', ['$event'])
  onClick(event) {
    if (this.disabled) {
      event.preventDefault();
      event.stopImmediatePropagation();
    } else if (this.isToggle) {
      this.pressed = !this.pressed;
    }
  }
  /**
   * Emits whenever button pressed state change
   **/
  @Output() readonly pressedChange = new EventEmitter<boolean>();
  protected readonly _pressedChange$ = new Subject<ButtonToggleChange>();
  get pressedChange$(): Observable<ButtonToggleChange> {
    return this._pressedChange$.asObservable();
  }
  /**
   * Controls button pressed state
   **/
  @HostBinding('class.pressed')
  get pressed(): boolean {
    return this._pressed;
  }
  set pressed(value: boolean) {
    if (this.pressed !== coerceBooleanProperty(value)) {
      this._pressed = !this.pressed;
      this.pressedChange.emit(this.pressed);
      this._pressedChange$.next({ source: this, pressed: this.pressed });
    }
  }
  protected _pressed: boolean = false;
  static ngAcceptInputType_pressed: BooleanInput;

  private destroy$ = new Subject<void>();

  constructor(public _elementRef: ElementRef, private cd: ChangeDetectorRef) {}

  _getHostElement() {
    return this._elementRef.nativeElement;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * @docs-private
   */
  _updatePressed(value: boolean) {
    this.pressed = value;
    this.cd.markForCheck();
  }
}
