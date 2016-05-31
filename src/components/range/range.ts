import {Component, Optional, Input, Output, EventEmitter, ViewChild, ViewChildren, QueryList, Renderer, ElementRef, Provider, Inject, forwardRef, ViewEncapsulation} from '@angular/core';
import {NG_VALUE_ACCESSOR} from '@angular/common';

import {Form} from '../../util/form';
import {isTrueProperty, isNumber, isString, isPresent, clamp} from '../../util/util';
import {Item} from '../item/item';
import {pointerCoord} from '../../util/dom';


const RANGE_VALUE_ACCESSOR = new Provider(
    NG_VALUE_ACCESSOR, {useExisting: forwardRef(() => Range), multi: true});

/**
 * @name Range
 * @description
 * The Range slider lets users select from a range of values by moving
 * the slider knob.
 *
 *
 *
 *
 *
 *
 * @demo /docs/v2/demos/range/
 */
@Component({
  selector: '.range-knob-handle',
  template:
    '<div class="range-pin" *ngIf="range.pin">{{_val}}</div>' +
    '<div class="range-knob"></div>',
  host: {
    '[class.range-knob-pressed]': 'pressed',
    '[style.left]': '_x',
    '[style.top]': '_y',
    '[style.transform]': '_trns',
    '[attr.aria-valuenow]': '_val',
    '[attr.aria-valuemin]': 'range.min',
    '[attr.aria-valuemax]': 'range.max',
    'role': 'slider',
    'tabindex': '0'
  }
})
export class RangeKnob {
  private _ratio: number;
  private _val: number;
  private _x: string;
  pressed: boolean;

  @Input() upper: boolean;

  constructor(@Inject(forwardRef(() => Range)) private range: Range) {}

  get ratio(): number {
    return this._ratio;
  }
  set ratio(ratio: number) {
    this._ratio = clamp(0, ratio, 1);
    this._val = this.range.ratioToValue(this._ratio);

    if (this.range.snaps) {
      this._ratio = this.range.valueToRatio(this._val);
    }
  }

  get value(): number {
    return this._val;
  }
  set value(val: number) {
    if (isString(val)) {
      val = Math.round(val);
    }
    if (isNumber(val) && !isNaN(val)) {
      this._ratio = this.range.valueToRatio(val);
      this._val = this.range.ratioToValue(this._ratio);
    }
  }

  position() {
    this._x = `${this._ratio * 100}%`;
  }

  ngOnInit() {
    if (isPresent(this.range.value)) {
      // we already have a value
      if (this.range.dualKnobs) {
        // we have a value and there are two knobs
        if (this.upper) {
          // this is the upper knob
          this.value = this.range.value.upper;

        } else {
          // this is the lower knob
          this.value = this.range.value.lower;
        }

      } else {
        // we have a value and there is only one knob
        this.value = this.range.value;
      }

    } else {
      // we do not have a value so set defaults
      this.ratio = ((this.range.dualKnobs && this.upper) ? 1 : 0);
    }

    this.position();
  }

}


/**
 * @name Range
 *
 * @description
 */
@Component({
  selector: 'ion-range',
  template:
    '<div class="range-slider" #slider>' +
      '<div class="range-tick" *ngFor="let t of _ticks" [style.left]="t.left" [class.range-tick-active]="t.active"></div>' +
      '<div class="range-bar"></div>' +
      '<div class="range-bar range-bar-active" [style.left]="_barL" [style.right]="_barR" #bar></div>' +
      '<div class="range-knob-handle"></div>' +
      '<div class="range-knob-handle" [upper]="true" *ngIf="_dual"></div>' +
    '</div>',
  host: {
    '[class.range-disabled]': '_disabled',
    '[class.range-pressed]': '_pressed',
  },
  directives: [RangeKnob],
  providers: [RANGE_VALUE_ACCESSOR],
  encapsulation: ViewEncapsulation.None,
})
export class Range {
  private _dual: boolean = false;
  private _pin: boolean;
  private _disabled: boolean = false;
  private _pressed: boolean;
  private _labelId: string;
  private _fn: Function;

  private _active: RangeKnob;
  private _start: Coordinates = null;
  private _rect: ClientRect;
  private _ticks: any[];
  private _barL: string;
  private _barR: string;

  private _min: number = 0;
  private _max: number = 100;
  private _step: number = 1;
  private _snaps: boolean = false;
  private _removes: Function[] = [];
  private _mouseRemove: Function;

  value: any;

  @ViewChild('bar') private _bar: ElementRef;
  @ViewChild('slider') private _slider: ElementRef;
  @ViewChildren(RangeKnob) private _knobs: QueryList<RangeKnob>;

  /**
   * @private
   */
  id: string;

  /**
   * @input {number} Minimum integer value of the range. Defaults to `0`.
   */
  @Input()
  get min(): number {
    return this._min;
  }
  set min(val: number) {
    val = Math.round(val);
    if (!isNaN(val)) {
      this._min = val;
    }
  }

  /**
   * @input {number} Maximum integer value of the range. Defaults to `100`.
   */
  @Input()
  get max(): number {
    return this._max;
  }
  set max(val: number) {
    val = Math.round(val);
    if (!isNaN(val)) {
      this._max = val;
    }
  }

  /**
   * @input {number} Specifies the value granularity. Defaults to `1`.
   */
  @Input()
  get step(): number {
    return this._step;
  }
  set step(val: number) {
    val = Math.round(val);
    if (!isNaN(val) && val > 0) {
      this._step = val;
    }
  }

  /**
   * @input {number} If true, the knob snaps to tick marks evenly spaced based on the step property value. Defaults to `false`.
   */
  @Input()
  get snaps(): boolean {
    return this._snaps;
  }
  set snaps(val: boolean) {
    this._snaps = isTrueProperty(val);
  }

  /**
   * @input {number} If true, a pin with integer value is shown when the knob is pressed. Defaults to `false`.
   */
  @Input()
  get pin(): boolean {
    return this._pin;
  }
  set pin(val: boolean) {
    this._pin = isTrueProperty(val);
  }

  /**
   * @input {boolean} Show two knobs. Defaults to `false`.
   */
  @Input()
  get dualKnobs(): boolean {
    return this._dual;
  }
  set dualKnobs(val: boolean) {
    this._dual = isTrueProperty(val);
  }

  /**
   * @output {Range} Expression to evaluate when the range value changes.
   */
  @Output() ionChange: EventEmitter<Range> = new EventEmitter();


  constructor(
    private _form: Form,
    @Optional() private _item: Item,
    private _renderer: Renderer
  ) {
    _form.register(this);

    if (_item) {
      this.id = 'rng-' + _item.registerInput('range');
      this._labelId = 'lbl-' + _item.id;
      _item.setCssClass('item-range', true);
    }
  }

  /**
   * @private
   */
  ngAfterViewInit() {
    let barL = '';
    let barR = '';

    let firstRatio = this._knobs.first.ratio;

    if (this._dual) {
      let lastRatio = this._knobs.last.ratio;
      barL = `${(Math.min(firstRatio, lastRatio) * 100)}%`;
      barR = `${100 - (Math.max(firstRatio, lastRatio) * 100)}%`;

    } else {
      barR = `${100 - (firstRatio * 100)}%`;
    }

    this._renderer.setElementStyle(this._bar.nativeElement, 'left', barL);
    this._renderer.setElementStyle(this._bar.nativeElement, 'right', barR);

    this.createTicks();

    // add touchstart/mousedown listeners
    this._renderer.listen(this._slider.nativeElement, 'touchstart', this.pointerDown.bind(this));
    this._mouseRemove = this._renderer.listen(this._slider.nativeElement, 'mousedown', this.pointerDown.bind(this));
  }

  /**
   * @private
   */
  pointerDown(ev: UIEvent) {
    console.debug(`range, ${ev.type}`);

    // prevent default so scrolling does not happen
    ev.preventDefault();
    ev.stopPropagation();

    if (ev.type === 'touchstart') {
      // if this was a touchstart, then let's remove the mousedown
      this._mouseRemove && this._mouseRemove();
    }

    // get the start coordinates
    this._start = pointerCoord(ev);

    // get the full dimensions of the slider element
    let rect: ClientRect = this._rect = this._slider.nativeElement.getBoundingClientRect();

    // figure out the offset
    // the start of the pointer could actually
    // have been left or right of the slider bar
    if (this._start.x < rect.left) {
      rect.xOffset = (this._start.x - rect.left);

    } else if (this._start.x > rect.right) {
      rect.xOffset = (this._start.x - rect.right);

    } else {
      rect.xOffset = 0;
    }

    // figure out which knob we're interacting with
    this.setActiveKnob(this._start, rect);

    // update the ratio for the active knob
    this.updateKnob(this._start, rect);

    // ensure past listeners have been removed
    this.clearListeners();

    // update the active knob's position
    this._active.position();
    this._pressed = this._active.pressed = true;

    // add a move listener depending on touch/mouse
    let renderer = this._renderer;
    let removes = this._removes;

    if (ev.type === 'touchstart') {
      removes.push(renderer.listen(this._slider.nativeElement, 'touchmove', this.pointerMove.bind(this)));
      removes.push(renderer.listen(this._slider.nativeElement, 'touchend', this.pointerUp.bind(this)));

    } else {
      removes.push(renderer.listenGlobal('body', 'mousemove', this.pointerMove.bind(this)));
      removes.push(renderer.listenGlobal('body', 'mouseup', this.pointerUp.bind(this)));
    }
  }

  /**
   * @private
   */
  pointerMove(ev: UIEvent) {
    console.debug(`range, ${ev.type}`);

    // prevent default so scrolling does not happen
    ev.preventDefault();
    ev.stopPropagation();

    if (this._start !== null && this._active !== null) {
      // only use pointer move if it's a valid pointer
      // and we already have start coordinates

      // update the ratio for the active knob
      this.updateKnob(pointerCoord(ev), this._rect);

      // update the active knob's position
      this._active.position();
      this._pressed = this._active.pressed = true;

    } else {
      // ensure listeners have been removed
      this.clearListeners();
    }
  }

  /**
   * @private
   */
  pointerUp(ev: UIEvent) {
    console.debug(`range, ${ev.type}`);

    // prevent default so scrolling does not happen
    ev.preventDefault();
    ev.stopPropagation();

    // update the ratio for the active knob
    this.updateKnob(pointerCoord(ev), this._rect);

    // update the active knob's position
    this._active.position();

    // clear the start coordinates and active knob
    this._start = this._active = null;

    // ensure listeners have been removed
    this.clearListeners();
  }

  /**
   * @private
   */
  clearListeners() {
    this._pressed = this._knobs.first.pressed = this._knobs.last.pressed = false;

    for (var i = 0; i < this._removes.length; i++) {
      this._removes[i]();
    }
    this._removes.length = 0;
  }

  /**
   * @private
   */
  setActiveKnob(current: Coordinates, rect: ClientRect) {
    // figure out which knob is the closest one to the pointer
    let ratio = (current.x - rect.left) / (rect.width);

    if (this._dual && Math.abs(ratio - this._knobs.first.ratio) > Math.abs(ratio - this._knobs.last.ratio)) {
      this._active = this._knobs.last;

    } else {
      this._active = this._knobs.first;
    }
  }

  /**
   * @private
   */
  updateKnob(current: Coordinates, rect: ClientRect) {
    // figure out where the pointer is currently at
    // update the knob being interacted with
    if (this._active) {
      let oldVal = this._active.value;
      this._active.ratio = (current.x - rect.left) / (rect.width);
      let newVal = this._active.value;

      if (oldVal !== newVal) {
        // value has been updated
        if (this._dual) {
          this.value = {
            lower: Math.min(this._knobs.first.value, this._knobs.last.value),
            upper: Math.max(this._knobs.first.value, this._knobs.last.value),
          };

        } else {
          this.value = newVal;
        }

        this.onChange(this.value);
      }

      this.updateBar();
    }
  }

  /**
   * @private
   */
  updateBar() {
    let firstRatio = this._knobs.first.ratio;

    if (this._dual) {
      let lastRatio = this._knobs.last.ratio;
      this._barL = `${(Math.min(firstRatio, lastRatio) * 100)}%`;
      this._barR = `${100 - (Math.max(firstRatio, lastRatio) * 100)}%`;

    } else {
      this._barL = '';
      this._barR = `${100 - (firstRatio * 100)}%`;
    }

    this.updateTicks();
  }

  /**
   * @private
   */
  createTicks() {
    if (this._snaps) {
      this._ticks = [];
      for (var value = this._min; value <= this._max; value += this._step) {
        var ratio = this.valueToRatio(value);
        this._ticks.push({
          ratio: ratio,
          left: `${ratio * 100}%`,
        });
      }
      this.updateTicks();

    } else {
      this._ticks = null;
    }
  }

  /**
   * @private
   */
  updateTicks() {
    if (this._snaps) {
      let ratio = this.ratio;
      if (this._dual) {
        let upperRatio = this.ratioUpper;

        this._ticks.forEach(t => {
          t.active = (t.ratio >= ratio && t.ratio <= upperRatio);
        });

      } else {
        this._ticks.forEach(t => {
          t.active = (t.ratio <= ratio);
        });
      }
    }
  }

  /**
   * @private
   */
  ratioToValue(ratio: number) {
    ratio = Math.round(((this._max - this._min) * ratio) + this._min);
    return Math.round(ratio / this._step) * this._step;
  }

  /**
   * @private
   */
  valueToRatio(value: number) {
    value = Math.round(clamp(this._min, value, this._max) / this._step) * this._step;
    return (value - this._min) / (this._max - this._min);
  }

  /**
   * @private
   */
  writeValue(val: any) {
    if (isPresent(val)) {
      let knobs = this._knobs;
      this.value = val;

      if (this._knobs) {
        if (this._dual) {
          knobs.first.value = val.lower;
          knobs.last.value = val.upper;
          knobs.last.position();

        } else {
          knobs.first.value = val;
        }
        knobs.first.position();
        this.updateBar();
      }
    }
  }

  /**
   * @private
   */
  registerOnChange(fn: Function): void {
    this._fn = fn;
    this.onChange = (val: any) => {
      fn(val);
      this.onTouched();
    };
  }

  /**
   * @private
   */
  registerOnTouched(fn) { this.onTouched = fn; }

  /**
   * @input {boolean} whether or not the checkbox is disabled or not.
   */
  @Input()
  get disabled(): boolean {
    return this._disabled;
  }
  set disabled(val: boolean) {
    this._disabled = isTrueProperty(val);
    this._item && this._item.setCssClass('item-range-disabled', this._disabled);
  }

  /**
   * Returns the ratio of the knob's is current location, which is a number between `0` and `1`.
   * If two knobs are used, this property represents the lower value.
   */
  get ratio(): number {
    if (this._dual) {
      return Math.min(this._knobs.first.ratio, this._knobs.last.ratio);
    }
    return this._knobs.first.ratio;
  }

  /**
   * Returns the ratio of the upper value's is current location, which is a number between `0` and `1`.
   * If there is only one knob, then this will return `null`.
   */
  get ratioUpper(): number {
    if (this._dual) {
      return Math.max(this._knobs.first.ratio, this._knobs.last.ratio);
    }
    return null;
  }

  /**
   * @private
   */
  onChange(val: any) {
    // used when this input does not have an ngModel or ngControl
    this.onTouched();
  }

  /**
   * @private
   */
  onTouched() {}

  /**
   * @private
   */
  ngOnDestroy() {
    this._form.deregister(this);
    this.clearListeners();
  }
}


export interface ClientRect {
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
  width?: number;
  height?: number;
  xOffset?: number;
  yOffset?: number;
}

export interface Coordinates {
  x?: number;
  y?: number;
}
