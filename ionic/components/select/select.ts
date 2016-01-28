import {Component, Optional, ElementRef, Renderer, Input, Output, EventEmitter, HostListener, ContentChildren, QueryList} from 'angular2/core';
import {NgControl} from 'angular2/common';

import {Alert} from '../alert/alert';
import {Form} from '../../util/form';
import {Item} from '../item/item';
import {merge, isTrueProperty, isBlank} from '../../util/util';
import {NavController} from '../nav/nav-controller';
import {Option} from '../option/option';

/**
 * @name Select
 * @description
 * The `ion-select` component is similar to an HTML `<select>` element, however,
 * Ionic's select component makes it easier for users to sort through and select
 * the preferred option or options. When users tap the select component, a
 * dialog will appear with all of the options in a large, easy to select list
 * for users.
 *
 * Under-the-hood the `ion-select` actually uses the
 * {@link ../../alert/Alert Alert API} to open up the overlay of options
 * which the user is presented with. Select can take numerous child
 * `ion-option` components. If `ion-option` is not given a `value` attribute
 * then it will use its text as the value.
 *
 * ### Single Value: Radio Buttons
 *
 * The standard `ion-select` component allows the user to select only one
 * option. When selecting only one option the alert overlay presents users with
 * a radio button styled list of options. The `ion-select` component's value
 * receives the value of the selected option's value.
 *
 * ```html
 * <ion-item>
 *   <ion-label>Gender</ion-label>
 *   <ion-select [(ngModel)]="gender">
 *     <ion-option value="f" checked="true">Female</ion-option>
 *     <ion-option value="m">Male</ion-option>
 *   </ion-select>
 * </ion-item>
 * ```
 *
 * ### Multiple Value: Checkboxes
 *
 * By adding the `multiple="true"` attribute to `ion-select`, users are able
 * to select multiple options. When multiple options can be selected, the alert
 * overlay presents users with a checkbox styled list of options. The
 * `ion-select multiple="true"` component's value receives an array of all the
 * selected option values. In the example below, because each option is not given
 * a `value`, then it'll use its text as the value instead.
 *
 * ```html
 * <ion-item>
 *   <ion-label>Toppings</ion-label>
 *   <ion-select [(ngModel)]="toppings" multiple="true">
 *     <ion-option>Bacon</ion-option>
 *     <ion-option>Black Olives</ion-option>
 *     <ion-option>Extra Cheese</ion-option>
 *     <ion-option>Mushrooms</ion-option>
 *     <ion-option>Pepperoni</ion-option>
 *     <ion-option>Sausage</ion-option>
 *   </ion-select>
 * <ion-item>
 * ```
 *
 * ### Alert Buttons
 * By default, the two buttons read `Cancel` and `OK`. The each button's text
 * can be customized using the `cancelText` and `okText` attributes:
 *
 * ```html
 * <ion-select okText="Okay" cancelText="Dismiss">
 *   ...
 * </ion-select>
 * ```
 *
 * ### Alert Options
 *
 * Remember how `ion-select` is really just a wrapper to `Alert`? By using
 * the `alertOptions` property you can pass custom options to the alert
 * overlay. This would be useful if there is a custom alert title,
 * subtitle or message. {@link ../../alert/Alert Alert API}
 *
 * ```html
 * <ion-select [alertOptions]="alertOptions">
 *   ...
 * </ion-select>
 * ```
 *
 * ```ts
 * this.alertOptions = {
 *   title: 'Pizza Toppings',
 *   subTitle: 'Select your toppings'
 * };
 * ```
 *
 */
@Component({
  selector: 'ion-select',
  template:
    '<div class="select-text">{{_text}}</div>' +
    '<div class="select-icon">' +
      '<div class="select-icon-inner"></div>' +
    '</div>' +
    '<button aria-haspopup="true" ' +
            '[id]="id" ' +
            '[attr.aria-labelledby]="_labelId" ' +
            '[attr.aria-disabled]="_disabled" ' +
            'class="item-cover">' +
    '</button>',
  host: {
    '[class.select-disabled]': '_disabled'
  }
})
export class Select {
  private _disabled: any = false;
  private _labelId: string;
  private _multi: boolean = false;
  private _options: QueryList<Option>;
  private _values: Array<string> = [];
  private _texts: Array<string> = [];
  private _text: string = '';

  /**
   * @private
   */
  id: string;

  @Input() cancelText: string = 'Cancel';
  @Input() okText: string = 'OK';
  @Input() alertOptions: any = {};
  @Input() checked: any = false;

  @Output() change: EventEmitter<any> = new EventEmitter();

  constructor(
    private _form: Form,
    private _elementRef: ElementRef,
    private _renderer: Renderer,
    @Optional() private _item: Item,
    @Optional() private _nav: NavController,
    @Optional() ngControl: NgControl
  ) {
    this._form.register(this);

    if (ngControl) {
      ngControl.valueAccessor = this;
    }

    if (_item) {
      this.id = 'sel-' + _item.registerInput('select');
      this._labelId = 'lbl-' + _item.id;
      this._item.setCssClass('item-select', true);
    }

    if (!_nav) {
      console.error('parent <ion-nav> required for <ion-select>');
    }
  }

  /**
   * @private
   */
  @HostListener('click', ['$event'])
  private _click(ev) {
    ev.preventDefault();
    ev.stopPropagation();

    if (this._disabled) return;
    console.debug('select, open alert');

    // the user may have assigned some options specifically for the alert
    let alertOptions = merge({}, this.alertOptions);

    // make sure their buttons array is removed from the options
    // and we create a new array for the alert's two buttons
    alertOptions.buttons = [this.cancelText];

    // if the alertOptions didn't provide an title then use the label's text
    if (!alertOptions.title && this._item) {
      alertOptions.title = this._item.getLabelText();
    }

    // user cannot provide inputs from alertOptions
    // alert inputs must be created by ionic from ion-options
    alertOptions.inputs = this._options.toArray().map(input => {
      return {
        type: (this._multi ? 'checkbox' : 'radio'),
        label: input.text,
        value: input.value,
        checked: input.checked
      }
    });

    // create the alert instance from our built up alertOptions
    let alert = Alert.create(alertOptions);

    if (this._multi) {
      // use checkboxes
      alert.setCssClass('select-alert multiple-select-alert');

    } else {
      // use radio buttons
      alert.setCssClass('select-alert single-select-alert');
    }

    alert.addButton({
      text: this.okText,
      handler: selectedValues => {
        this.value = selectedValues;
        this.onChange(selectedValues);
        this.change.emit(selectedValues);
      }
    });

    this._nav.present(alert, alertOptions);
  }

  @Input()
  get multiple() {
    return this._multi;
  }

  set multiple(val) {
    this._multi = isTrueProperty(val);
  }

  @Input()
  get value(): any {
    return (this._multi ? this._values : this._values.join());
  }

  set value(val: any) {
    // passed in value could be either an array, undefined or a string
    if (this._disabled) {
      this._values = (Array.isArray(val) ? val : isBlank(val) ? [] : [val]);
      this.updateOptions();
    }
  }

  get text() {
    return (this._multi ? this._texts : this._texts.join());
  }

  @ContentChildren(Option)
  private set options(val: QueryList<Option>) {
    this._options = val;

    if (!this._values.length) {
      // there are no values set at this point
      // so check to see who should be checked
      this._values = val.toArray().filter(o => o.checked).map(o => o.value);
    }

    this.updateOptions();
  }

  private updateOptions() {
    this._texts = [];

    if (this._options) {
      this._options.toArray().forEach(option => {
        // check this option if the option's value is in the values array
        option.checked = (this._values.indexOf(option.value) > -1);
        if (option.checked) {
          this._texts.push(option.text);
        }
      });
    }

    this._text = this._texts.join(', ');
  }

  ngAfterContentInit() {
    // using a setTimeout here to prevent
    // "has changed after it was checked" error
    // this will be fixed in future ng2 versions
    setTimeout(()=> {
      this.onChange(this._values);
    });
  }

  @Input()
  get disabled() {
    return this._disabled;
  }

  set disabled(val) {
    this._disabled = isTrueProperty(val);
    this._item && this._item.setCssClass('item-select-disabled', this._disabled);
  }

  /**
   * @private
   * Angular2 Forms API method called by the model (Control) on change to update
   * the checked value.
   * https://github.com/angular/angular/blob/master/modules/angular2/src/forms/directives/shared.ts#L34
   */
  writeValue(val) {
    if (!isBlank(val)) {
      this.value = val;
    }
  }

  /**
   * @private
   */
  onChange(val) {}

  /**
   * @private
   */
  onTouched(val) {}

  /**
   * @private
   * Angular2 Forms API method called by the view (NgControl) to register the
   * onChange event handler that updates the model (Control).
   * https://github.com/angular/angular/blob/master/modules/angular2/src/forms/directives/shared.ts#L27
   * @param {Function} fn  the onChange event handler.
   */
  registerOnChange(fn) { this.onChange = fn; }

  /**
   * @private
   * Angular2 Forms API method called by the the view (NgControl) to register
   * the onTouched event handler that marks model (Control) as touched.
   * @param {Function} fn  onTouched event handler.
   */
  registerOnTouched(fn) { this.onTouched = fn; }

  /**
   * @private
   */
  ngOnDestroy() {
    this._form.deregister(this);
  }
}
