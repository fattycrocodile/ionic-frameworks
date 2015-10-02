import {FORM_DIRECTIVES, NgControl, NgControlGroup,
  Component, View, Injectable, NgClass, NgIf, NgFor} from 'angular2/angular2';

import {Overlay} from '../overlay/overlay';
import {Animation} from '../../animations/animation';
import {Ion} from '../ion';
import * as util from 'ionic/util';


/**
 * @name Popup
 * @description
 * The Ionic Popup service allows the creation of popup windows that require the user to respond in order to continue.
 *
 * The popup service has support for more flexible versions of the built in `alert()`, `prompt()`, and `confirm()` functions that users are used to, in addition to allowing popups with completely custom content and look.
 *
 * @usage
 * ```ts
 * class myApp {
 *
 *   constructor(popup: Popup) {
 *     this.popup = popup;
 *   }
 *
 *   doAlert() {
 *     this.popup.alert({
 *       title: "New Friend!",
 *       template: "Your friend, Obi wan Kenobi, just accepted your friend request!",
 *       cssClass: 'my-alert'
 *     }).then(() => {
 *       console.log('Alert closed');
 *     });
 *   }
 *
 *   doPrompt() {
 *     this.popup.prompt({
 *       title: "New Album",
 *       template: "Enter a name for this new album you're so keen on adding",
 *       inputPlaceholder: "Title",
 *       okText: "Save",
 *       okType: "secondary"
 *     }).then((name) => {
 *       console.log('Name entered:', name);
 *     }, () => {
 *       console.error('Prompt closed');
 *     });
 *   }
 *
 *   doConfirm() {
 *     this.popup.confirm({
 *       title: "Use this lightsaber?",
 *       subTitle: "You can't exchange lightsabers",
 *       template: "Do you agree to use this lightsaber to do good across the intergalactic galaxy?",
 *       cancelText: "Disagree",
 *       okText: "Agree"
 *     }).then((result, ev) => {
 *       console.log('Confirmed!', result);
 *     }, () => {
 *       console.error('Not confirmed!');
 *     });
 *   }
 * }
 * ```
 */
@Injectable()
export class Popup extends Overlay {

  /**
   * TODO
   * @param {TODO} opts  TODO
   * @returns {object} A promise
   */
  popup(opts) {
    return new Promise((resolve, reject)=> {
      let config = this.config;
      let defaults = {
        enterAnimation: config.setting('popupPopIn'),
        leaveAnimation: config.setting('popupPopOut'),
      };

      opts.promiseResolve = resolve;
      opts.promiseReject = reject;

      return this.create(OVERLAY_TYPE, StandardPopup, defaults, opts);
    });
  }

  /**
   * Show a simple alert popup with a message and one button
   * that the user can tap to close the popup.
   *
   * @param {object} opts The options for showing the alert, of the form:
   *
   * ```
   * {
   *   title: '', // String. The title of the popup.
   *   cssClass: '', // String (optional). The custom CSS class name.
   *   subTitle: '', // String (optional). The sub-title of the popup.
   *   template: '', // String (optional). The html template to place in the popup body.
   *   templateUrl: '', // String (optional). The URL of an html template to place in the popup body.
   *   okText: '', // String (default: 'OK'). The text of the OK button.
   *   okType: '', // String (default: 'primary'). The type of the OK button.
   * }
   * ```
   *
   * @returns {object} A promise which is resolved when the popup is closed.
   */
  alert(opts={}) {
    if (typeof opts === 'string') {
      opts = {
        title: opts
      };
    }
    let button = {
      text: opts.okText || 'OK',
      type: opts.okType || 'primary',
      onTap: (event, popupRef) => {
        // Allow it to close
        //resolve();
      }
    };
    opts = util.extend({
      cancel: () => {
        //reject();
      },
      buttons: [
        button
      ]
    }, opts);

    return this.popup(opts);
  }

  /**
   * Show a simple confirm popup with a message, Cancel and OK button.
   *
   * Resolves the promise with true if the user presses the OK button, and false if the user presses the Cancel button.
   *
   * @param {object} opts The options for showing the confirm, of the form:
   *
   * ```
   * {
   *   title: '', // String. The title of the popup.
   *   cssClass: '', // String (optional). The custom CSS class name.
   *   subTitle: '', // String (optional). The sub-title of the popup.
   *   template: '', // String (optional). The html template to place in the popup body.
   *   templateUrl: '', // String (optional). The URL of an html template to place in the popup body.
   *   cancelText: '', // String (default: 'Cancel'). The text of the Cancel button.
   *   cancelType: '', // String (default: 'primary'). The type of the Cancel button.
   *   okText: '', // String (default: 'OK'). The text of the OK button.
   *   okType: '', // String (default: 'primary'). The type of the OK button.
   * }
   * ```
   *
   * @returns {object} A promise which is resolved when the popup is closed.
   */
  confirm(opts={}) {
    if (typeof opts === 'string') {
      opts = {
        title: opts
      }
    }
    let okButton = {
      text: opts.okText || 'OK',
      type: opts.okType || 'primary',
      onTap: (event, popupRef) => {
        // Allow it to close
      }
    }
    let cancelButton = {
      text: opts.cancelText || 'Cancel',
      type: opts.cancelType || 'primary',
      isCancel: true,
      onTap: (event, popupRef) => {
        // Allow it to close
      }
    }
    opts = util.extend({
      cancel: () => {
      },
      buttons: [
        cancelButton, okButton
      ]
    }, opts);
    return this.popup(opts);
  }

  /**
   * Show a simple prompt popup with a message, input, Cancel and OK button.
   *
   * Resolves the promise with the value of the input if the user presses OK, and with undefined if the user presses Cancel.
   *
   * @param {object} opts The options for showing the prompt, of the form:
   *
   * ```
   * {
   *   title: '', // String. The title of the popup.
   *   cssClass: '', // String (optional). The custom CSS class name.
   *   subTitle: '', // String (optional). The sub-title of the popup.
   *   template: '', // String (optional). The html template to place in the popup body.
   *   templateUrl: '', // String (optional). The URL of an html template to place in the popup body.
   *   inputType: // String (default: 'text'). The type of input to use.
   *   inputPlaceholder: // String (default: ''). A placeholder to use for the input.
   *   cancelText: '', // String (default: 'Cancel'). The text of the Cancel button.
   *   cancelType: '', // String (default: 'primary'). The type of the Cancel button.
   *   okText: '', // String (default: 'OK'). The text of the OK button.
   *   okType: '', // String (default: 'primary'). The type of the OK button.
   * }
   * ```
   *
   * @returns {object} A promise which is resolved when the popup is closed.
   */
  prompt(opts={}) {
    if (typeof opts === 'string') {
      opts = {
        title: opts
      };
    }
    let okButton = {
      text: opts.okText || 'OK',
      type: opts.okType || 'primary',
      onTap: (event, popupRef) => {
        // Allow it to close
      }
    }

    let cancelButton = {
      text: opts.cancelText || 'Cancel',
      type: opts.cancelType || 'primary',
      isCancel: true,
      onTap: (event, popupRef) => {
        // Allow it to close
      }
    }

    opts = util.extend({
      showPrompt: true,
      promptPlaceholder: '',
      cancel: () => {
      },
      buttons: [
        cancelButton, okButton
      ]
    }, opts);

    return this.popup(opts);
  }

  /**
   * TODO
   * @param {TODO} handle  TODO
   * @returns {TODO} TODO
   */
  get(handle) {
    if (handle) {
      return this.getByHandle(handle, OVERLAY_TYPE);
    }
    return this.getByType(OVERLAY_TYPE);
  }

}

const OVERLAY_TYPE = 'popup';


@Component({
  selector: 'ion-popup-default'
})
@View({
  template:
  '<backdrop (click)="_cancel($event)" tappable disable-activated></backdrop>' +
  '<popup-wrapper [ng-class]="cssClass">' +
    '<div class="popup-head">' +
      '<h2 class="popup-title" [inner-html]="title" *ng-if="title"></h2>' +
      '<h3 class="popup-sub-title" [inner-html]="subTitle" *ng-if="subTitle"></h3>' +
    '</div>' +
    '<div class="popup-body">' +
      '<div [inner-html]="template" *ng-if="template"></div>' +
      '<input type="{{inputType || \'text\'}}" placeholder="{{inputPlaceholder}}" *ng-if="showPrompt" class="prompt-input">' +
    '</div>' +
    '<div class="popup-buttons" *ng-if="buttons.length">' +
      '<button *ng-for="#button of buttons" (click)="buttonTapped(button, $event)" [inner-html]="button.text"></button>' +
    '</div>' +
  '</popup-wrapper>',
  directives: [FORM_DIRECTIVES, NgClass, NgIf, NgFor]
})

class StandardPopup {
  constructor(popup: Popup) {
    this.popup = popup;
  }
  onInit() {
    setTimeout(() => {
      this.element = this.overlayRef.getElementRef().nativeElement;
      this.promptInput = this.element.querySelector('input');
      if (this.promptInput) {
        this.promptInput.value = '';
      }
    });
  }
  buttonTapped(button, event) {
    let promptValue = this.promptInput && this.promptInput.value;

    let retVal = button.onTap && button.onTap(event, this, {
      promptValue: promptValue
    });

    // If the event.preventDefault() wasn't called, close
    if (!event.defaultPrevented) {
      // If this is a cancel button, reject the promise
      if (button.isCancel) {
        this.promiseReject();
      } else {
        // Resolve with the prompt value
        this.promiseResolve(promptValue);
      }
      return this.overlayRef.close();
    }

  }
  _cancel(event) {
    this.cancel && this.cancel(event);

    if (!event.defaultPrevented) {
      this.promiseReject();
      return this.overlayRef.close();
    }
  }
}

class PopupAnimation extends Animation {
  constructor(element) {
    super(element);
    this
      .easing('ease-in-out')
      .duration(200);

    this.backdrop = new Animation(element.querySelector('backdrop'));
    this.wrapper = new Animation(element.querySelector('popup-wrapper'));

    this.add(this.backdrop, this.wrapper);
  }
}

/**
 * Animations for modals
 */
class PopupPopIn extends PopupAnimation {
  constructor(element) {
    super(element);
    this.wrapper.fromTo('opacity', '0', '1')
    this.wrapper.fromTo('scale', '1.1', '1');

    this.backdrop.fromTo('opacity', '0', '0.3')
  }
}
Animation.register('popup-pop-in', PopupPopIn);

class PopupPopOut extends PopupAnimation {
  constructor(element) {
    super(element);
    this.wrapper.fromTo('opacity', '1', '0')
    this.wrapper.fromTo('scale', '1', '0.9');

    this.backdrop.fromTo('opacity', '0.3', '0')
  }
}
Animation.register('popup-pop-out', PopupPopOut);

class PopupMdPopIn extends PopupPopIn {
  constructor(element) {
    super(element);
    this.backdrop.fromTo('opacity', '0', '0.5')
  }
}
Animation.register('popup-md-pop-in', PopupMdPopIn);

class PopupMdPopOut extends PopupPopOut {
  constructor(element) {
    super(element);
    this.backdrop.fromTo('opacity', '0.5', '0')
  }
}
Animation.register('popup-md-pop-out', PopupMdPopOut);
