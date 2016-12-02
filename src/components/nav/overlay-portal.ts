import { ComponentFactoryResolver, Directive, ElementRef, forwardRef, Inject, Input, NgZone, Optional, Renderer, ViewContainerRef } from '@angular/core';

import { App } from '../app/app';
import { Config } from '../../config/config';
import { DeepLinker } from '../../navigation/deep-linker';
import { GestureController } from '../../gestures/gesture-controller';
import { Keyboard } from '../../util/keyboard';
import { NavControllerBase } from '../../navigation/nav-controller-base';
import { TransitionController } from '../../transitions/transition-controller';
import { DomController } from '../../util/dom-controller';

/**
 * @private
 */
@Directive({
  selector: '[overlay-portal]',
})
export class OverlayPortal extends NavControllerBase {
  constructor(
    @Inject(forwardRef(() => App)) app: App,
    config: Config,
    keyboard: Keyboard,
    elementRef: ElementRef,
    zone: NgZone,
    renderer: Renderer,
    cfr: ComponentFactoryResolver,
    gestureCtrl: GestureController,
    transCtrl: TransitionController,
    @Optional() linker: DeepLinker,
    viewPort: ViewContainerRef,
    domCtrl: DomController,
  ) {
    super(null, app, config, keyboard, elementRef, zone, renderer, cfr, gestureCtrl, transCtrl, linker, domCtrl);
    this._isPortal = true;
    this._init = true;
    this.setViewport(viewPort);

    // on every page change make sure the portal has
    // dismissed any views that should be auto dismissed on page change
    app.viewDidLeave.subscribe(this.dismissPageChangeViews.bind(this));
  }

  @Input('overlay-portal')
  set _overlayPortal(val: number) {
    this._zIndexOffset = (val || 0);
  }

}

