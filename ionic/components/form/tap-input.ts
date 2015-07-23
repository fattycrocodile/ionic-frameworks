import {Parent, Ancestor, Optional, ElementRef, Attribute, Directive} from 'angular2/angular2';

import {IonInput} from './input';
import {IonicApp} from '../app/app';
import {IonicConfig} from '../../config/config';
import {Content} from '../content/content';
import {Checkbox} from '../checkbox/checkbox';
import {RadioButton} from '../radio/radio';


@Directive({
  selector: 'input[type=checkbox],input[type=radio]',
  properties: [ 'checked', 'name', 'value' ],
  host: {
    '[checked]': 'checked',
    '[value]': 'value',
    '[attr.name]': 'name',
    '(change)': 'onChangeEvent($event)'
  }
})
export class TapInput extends IonInput {
  constructor(
    @Optional() @Parent() checkboxContainer: Checkbox,
    @Optional() @Parent() radioContainer: RadioButton,
    @Optional() @Ancestor() scrollView: Content,
    @Attribute('type') type: string,
    elementRef: ElementRef,
    app: IonicApp,
    config: IonicConfig
  ) {
    super(elementRef, app, config, scrollView);

    let container = checkboxContainer || radioContainer;

    if (container) {
      container.registerInput(this);
      this.container = container;
    }

    this.type = type;
    this.elementRef = elementRef;
    this.tabIndex = this.tabIndex || '';
  }

  //to detect switching/selecting inputs with the keyboard
  //view -> model (Control)
  onChangeEvent(ev) {
    this.container && this.container.onChangeEvent(this);
  }

}
