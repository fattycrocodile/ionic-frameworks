import { Component, Element, Event, EventEmitter, Prop, State, Watch } from '@stencil/core';
import { debounce } from '../../utils/helpers';


@Component({
  tag: 'ion-searchbar',
  styleUrls: {
    ios: 'searchbar.ios.scss',
    md: 'searchbar.md.scss'
  },
  host: {
    theme: 'searchbar'
  }
})
export class Searchbar {
  private _isCancelVisible: boolean = false;
  private _shouldBlur: boolean = true;
  private _shouldAlignLeft: boolean = true;

  @Element() private el: HTMLElement;

  @State() activated: boolean = false;

  @State() focused: boolean = false;


  /**
   * @output {Event} Emitted when the Searchbar input has changed, including when it's cleared.
   */
  @Event() ionInput: EventEmitter;

  /**
   * @output {Event} Emitted when the cancel button is clicked.
   */
  @Event() ionCancel: EventEmitter;

  /**
   * @output {Event} Emitted when the clear input button is clicked.
   */
  @Event() ionClear: EventEmitter;

  /**
   * @output {Event} Emitted when the input loses focus.
   */
  @Event() ionBlur: EventEmitter;

  /**
   * @output {Event} Emitted when the input has focus.
   */
  @Event() ionFocus: EventEmitter;

  /**
   * @input {string} The color to use from your Sass `$colors` map.
   * Default options are: `"primary"`, `"secondary"`, `"danger"`, `"light"`, and `"dark"`.
   * For more information, see [Theming your App](/docs/theming/theming-your-app).
   */
  @Prop() color: string;

  /**
   * @input {string} The mode determines which platform styles to use.
   * Possible values are: `"ios"` or `"md"`.
   * For more information, see [Platform Styles](/docs/theming/platform-specific-styles).
   */
  @Prop() mode: 'ios' | 'md';

  /**
   * @input {boolean} If true, enable searchbar animation. Default `false`.
   */
  @Prop({ mutable: true }) animated: boolean = false;

  /**
   * @input {string} Set the input's autocomplete property. Values: `"on"`, `"off"`. Default `"off"`.
   */
  @Prop({ mutable: true }) autocomplete: string = 'off';

  /**
   * @input {string} Set the input's autocorrect property. Values: `"on"`, `"off"`. Default `"off"`.
   */
  @Prop({ mutable: true }) autocorrect: string = 'off';

  /**
   * @input {string} Set the the cancel button text. Default: `"Cancel"`.
   */
  @Prop({ mutable: true }) cancelButtonText: string = 'Cancel';

  /**
   * @input {number} Set the amount of time, in milliseconds, to wait to trigger the `ionInput` event after each keystroke. Default `250`.
   */
  @Prop({ mutable: true }) debounce: number = 250;

  @Watch('debounce')
  private debounceInput() {
    this.ionInput.emit = debounce(
      this.ionInput.emit.bind(this.ionInput),
      this.debounce
    );
  }

  /**
   * @input {string} Set the input's placeholder. Default `"Search"`.
   */
  @Prop({ mutable: true }) placeholder: string = 'Search';

  /**
   * @input {boolean} If true, show the cancel button. Default `false`.
   */
  @Prop({ mutable: true }) showCancelButton: boolean = false;

  /**
   * @input {boolean} If true, enable spellcheck on the input. Default `false`.
   */
  @Prop({ mutable: true }) spellcheck: boolean = false;

  /**
   * @input {string} Set the type of the input. Values: `"text"`, `"password"`, `"email"`, `"number"`, `"search"`, `"tel"`, `"url"`. Default `"search"`.
   */
  @Prop({ mutable: true }) type: string = 'search';

  /**
   * @input {string} the value of the searchbar.
   */
  @Prop({ mutable: true }) value: string;


  componentDidLoad() {
    this.positionElements();
    this.debounceInput();
  }

  /**
   * Clears the input field and triggers the control change.
   */
  clearInput(ev: UIEvent) {
    this.ionClear.emit({event: ev});

    // setTimeout() fixes https://github.com/ionic-team/ionic/issues/7527
    // wait for 4 frames
    setTimeout(() => {
      let value = this.value;
      if (value !== undefined && value !== '') {
        this.value = '';
        this.ionInput.emit({event: ev});
      }
    }, 16 * 4);
    this._shouldBlur = false;
  }

  /**
   * Clears the input field and tells the input to blur since
   * the clearInput function doesn't want the input to blur
   * then calls the custom cancel function if the user passed one in.
   */
  cancelSearchbar(ev: UIEvent) {
    this.ionCancel.emit({event: ev});

    this.clearInput(ev);
    this._shouldBlur = true;
    this.activated = false;
  }

  /**
   * Update the Searchbar input value when the input changes
   */
  inputChanged(ev: any) {
    this.value = ev.target.value;
    this.ionInput.emit(ev);
  }

  inputUpdated() {
    // const inputEle = this.el.querySelector('.searchbar-input') as HTMLInputElement;

    // It is important not to re-assign the value if it is the same, because,
    // otherwise, the caret is moved to the end of the input
    // if (inputEle && inputEle.value !== this.value) {
    //   // inputEle.value = this.value;
    //   this.value = inputEle.value;
    // }

    this.positionElements();
  }

  /**
   * Sets the Searchbar to not focused and checks if it should align left
   * based on whether there is a value in the searchbar or not.
   */
  inputBlurred() {
    const inputEle = this.el.querySelector('.searchbar-input') as HTMLElement;

    // _shouldBlur determines if it should blur
    // if we are clearing the input we still want to stay focused in the input
    if (this._shouldBlur === false) {
      inputEle.focus();
      this._shouldBlur = true;
      this.ionBlur.emit({this: this});
      this.inputUpdated();
      return;
    }

    this.focused = false;
    this.positionElements();
  }

  /**
   * Sets the Searchbar to focused and active on input focus.
   */
  inputFocused() {
    this.activated = true;

    this.focused = true;
    this.ionFocus.emit({this: this});
    this.inputUpdated();

    this.positionElements();
  }

  /**
   * Positions the input search icon, placeholder, and the cancel button
   * based on the input value and if it is focused. (ios only)
   */
  positionElements() {
    const prevAlignLeft = this._shouldAlignLeft;
    const _shouldAlignLeft = (!this.animated || (this.value && this.value.toString().trim() !== '') || this.focused === true);
    this._shouldAlignLeft = _shouldAlignLeft;

    if (this.mode !== 'ios') {
      return;
    }

    if (prevAlignLeft !== _shouldAlignLeft) {
      this.positionPlaceholder();
    }

    if (this.animated) {
      this.positionCancelButton();
    }
  }

  /**
   * Positions the input placeholder
   */
  positionPlaceholder() {
    const isRTL = document.dir === 'rtl';
    const inputEle = this.el.querySelector('.searchbar-input') as HTMLElement;
    const iconEle = this.el.querySelector('.searchbar-search-icon') as HTMLElement;

    if (this._shouldAlignLeft) {
      inputEle.removeAttribute('style');
      iconEle.removeAttribute('style');

    } else {
      // Create a dummy span to get the placeholder width
      var tempSpan = document.createElement('span');
      tempSpan.innerHTML = this.placeholder;
      document.body.appendChild(tempSpan);

      // Get the width of the span then remove it
      var textWidth = tempSpan.offsetWidth;
      document.body.removeChild(tempSpan);

      // Calculate the input padding
      var inputLeft = 'calc(50% - ' + (textWidth / 2) + 'px)';

      // Calculate the icon margin
      var iconLeft = 'calc(50% - ' + ((textWidth / 2) + 30) + 'px)';

      // Set the input padding start and icon margin start
      if (isRTL) {
        inputEle.style.paddingRight = inputLeft;
        iconEle.style.marginRight = iconLeft;
      } else {
        inputEle.style.paddingLeft = inputLeft;
        iconEle.style.marginLeft = iconLeft;
      }
    }
  }

  /**
   * Show the iOS Cancel button on focus, hide it offscreen otherwise
   */
  positionCancelButton() {
    const isRTL = document.dir === 'rtl';
    const cancelButton = this.el.querySelector('.searchbar-ios-cancel') as HTMLElement;
    const shouldShowCancel = this.focused;

    if (shouldShowCancel !== this._isCancelVisible) {
      var cancelStyle = cancelButton.style;
      this._isCancelVisible = shouldShowCancel;
      if (shouldShowCancel) {
        if (isRTL) {
          cancelStyle.marginLeft = '0';
        } else {
          cancelStyle.marginRight = '0';
        }
      } else {
        var offset = cancelButton.offsetWidth;
        if (offset > 0) {
          if (isRTL) {
            cancelStyle.marginLeft = -offset + 'px';
          } else {
            cancelStyle.marginRight = -offset + 'px';
          }
        }
      }
    }
  }

  hostData() {
    return {
      class: {
        'searchbar-active': this.activated,
        'searchbar-animated': this.animated,
        'searchbar-has-value': (this.value !== undefined && this.value !== ''),
        'searchbar-show-cancel': this.showCancelButton,
        'searchbar-left-aligned': this._shouldAlignLeft,
        'searchbar-has-focus': this.focused
      }
    };
  }

  // TODO remove the ion-buttons and replace with native buttons to remove
  // the button dependency
  render() {
    return [
      <div class='searchbar-input-container'>
        <ion-button
          onClick={this.cancelSearchbar.bind(this)}
          onMouseDown={this.cancelSearchbar.bind(this)}
          fill='clear'
          color='dark'
          class='searchbar-md-cancel'>
            <ion-icon name='md-arrow-back'></ion-icon>
        </ion-button>
        <div class='searchbar-search-icon'></div>
        <input
          class='searchbar-input'
          onInput={this.inputChanged.bind(this)}
          onBlur={this.inputBlurred.bind(this)}
          onFocus={this.inputFocused.bind(this)}
          placeholder={this.placeholder}
          type={this.type}
          value={this.value}
          autoComplete={this.autocomplete}
          autoCorrect={this.autocorrect}
          spellCheck={this.spellcheck}/>
        <ion-button
          fill='clear'
          class='searchbar-clear-icon'
          onClick={this.clearInput.bind(this)}
          onMouseDown={this.clearInput.bind(this)}>
        </ion-button>
      </div>,
      <ion-button
        tabindex={this.activated ? 1 : -1}
        fill='clear'
        onClick={this.cancelSearchbar.bind(this)}
        onMouseDown={this.cancelSearchbar.bind(this)}
        class='searchbar-ios-cancel'>
          {this.cancelButtonText}
      </ion-button>
    ];
  }
}
