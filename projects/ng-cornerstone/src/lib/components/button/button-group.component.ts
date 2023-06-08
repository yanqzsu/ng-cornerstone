import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  EventEmitter,
  HostBinding,
  Input,
  OnDestroy,
  Output,
  QueryList,
} from '@angular/core';
import { debounceTime, filter, from, merge, Observable, startWith, Subject } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';

import { ButtonComponent, ButtonToggleChange } from './button.component';
import { BooleanInput } from '@angular/cdk/coercion';
import { InputBoolean } from '../../core';

@Component({
  selector: 'nc-button-group',
  template: ` <ng-content></ng-content> `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonGroupComponent implements AfterContentInit, OnDestroy {
  protected lastEmittedValue: any[] = [];

  protected readonly destroy$: Subject<void> = new Subject<void>();
  protected readonly buttonsChange$ = new Subject<ButtonComponent[]>();

  @ContentChildren(ButtonComponent)
  readonly buttons!: QueryList<ButtonComponent>;

  @Input()
  @InputBoolean()
  protected disabled = false;
  static ngAcceptInputType_disabled: BooleanInput;

  /**
   * Allows to keep multiple button toggles pressed. Off by default.
   */
  @Input()
  @InputBoolean()
  protected multiple: boolean = false;
  static ngAcceptInputType_multiple: BooleanInput;

  /**
   * Emits when `nbButtonToggle` pressed state change. `$event` contains an array of the currently pressed button
   * toggles.
   */
  @Output() valueChange = new EventEmitter<any[]>();

  @HostBinding('attr.role') role = 'group';

  constructor(protected cd: ChangeDetectorRef) {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngAfterContentInit(): void {
    this.buttonsChange$.pipe(takeUntil(this.destroy$)).subscribe((buttons: ButtonComponent[]) => {
      this.listenButtonPressedState(buttons);
    });

    this.buttons.changes
      .pipe(
        // `buttons.changes` emit during change detection run after projected content already was initialized.
        // So at this time, it's too late to update projected buttons properties as updating bindings after
        // initialization doesn't make sense. Changes won't be picked up and should cause an "expression changed" error.
        // Instead, we wrap the new buttons list into a promise to defer update to the following microtask and also to
        // trigger change detection one more time.
        switchMap((buttons: QueryList<ButtonComponent>) => from(Promise.resolve(buttons.toArray()))),
        takeUntil(this.destroy$),
      )
      .subscribe((value) => this.buttonsChange$.next(value));

    this.buttonsChange$.next(this.buttons.toArray());
  }

  protected listenButtonPressedState(buttons: ButtonComponent[]): void {
    const toggleButtons: ButtonComponent[] = buttons.filter((button: ButtonComponent) => {
      return button.isToggle;
    });

    if (!toggleButtons.length) {
      return;
    }

    const buttonsPressedChange$: Observable<ButtonToggleChange>[] = toggleButtons.map(
      (button: ButtonComponent) => button.pressedChange$,
    );

    merge(...buttonsPressedChange$)
      .pipe(
        filter(({ pressed }: ButtonToggleChange) => !this.multiple && pressed),
        takeUntil(merge(this.buttonsChange$, this.destroy$)),
      )
      .subscribe(({ source }: ButtonToggleChange) => {
        toggleButtons
          .filter((button: ButtonComponent) => button !== source)
          .forEach((button: ButtonComponent) => button._updatePressed(false));
      });

    merge(...buttonsPressedChange$)
      .pipe(
        // Use startWith to emit if some buttons are initially pressed.
        startWith(''),
        // Use debounce to emit change once when pressed state change in multiple button toggles.
        debounceTime(0),
        takeUntil(merge(this.buttonsChange$, this.destroy$)),
      )
      .subscribe(() => this.emitCurrentValue(toggleButtons));
  }

  protected emitCurrentValue(toggleButtons: ButtonComponent[]): void {
    const pressedToggleValues = toggleButtons
      .filter((b: ButtonComponent) => b.pressed && typeof b.value !== 'undefined')
      .map((b: ButtonComponent) => b.value);

    // Prevent multiple emissions of empty value.
    if (pressedToggleValues.length === 0 && this.lastEmittedValue.length === 0) {
      return;
    }

    this.valueChange.emit(pressedToggleValues);
    this.lastEmittedValue = pressedToggleValues;
  }
}
