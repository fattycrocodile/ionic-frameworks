import {Directive, Component, View, Host, ElementRef, Compiler, DynamicComponentLoader, AppViewManager, forwardRef, Injector, NgZone, ViewContainerRef} from 'angular2/angular2';

import {IonicApp} from '../app/app';
import {IonicConfig} from '../../config/config';
import {NavController} from '../nav/nav-controller';
import {ViewController} from '../nav/view-controller';
import {Tabs} from './tabs';


/**
 * _For basic Tabs usage, see the [Tabs section](../../../../components/#tabs)
 * of the Component docs._
 *
 * Tab components are basic navigation controllers used with Tabs.  Much like
 * Nav, they are a subclass of NavController and can be used to navigate
 * to pages in and manipulate the navigation stack of a particular tab.
 *
 * For more information on using navigation controllers like Tab or [Nav](../../nav/Nav/),
 * take a look at the [NavController API reference](../NavController/).
 *
 * See the [Tabs API reference](../Tabs/) for more details on configuring Tabs
 * and the TabBar.
 *
 * Like Nav, you must set a root page to be loaded initially for each Tab with
 * the 'root' property:
 * ```
 * import {GettingStartedPage} from 'getting-started';
 * @App({
 *   template: `<ion-tabs>
 *                <ion-tab [root]="tabOneRoot"></ion-tab>
 *                <ion-tab [root]="tabTwoRoot"></ion-tab>
 *              <ion-tabs>`
 * })
 * class MyApp {
 *   constructor(){
 *     this.tabOneRoot = GettingStartedPage;
 *     this.tabTwoRoot = GettingStartedPage;
 *   }
 * }
 * ```
 * <h3 id="tab_properties">Tab Properties</h3>
 * The Tabs component automatically creates the TabBar from the properties you
 * set on each Tab.
 *
 * To change the title and icon, use the `tab-title` and `tab-icon`
 * inputs:
 * ```html
 * <ion-tabs>
 * 	 <ion-tab tab-title="Home" tab-icon="home" [root]="tabOneRoot"></ion-tab>
 * 	 <ion-tab tab-title="Login" tab-icon="star" [root]="tabTwoRoot"></ion-tab>
 * <ion-tabs>
 * ```
 */
@Component({
  selector: 'ion-tab',
  inputs: [
    'root',
    'tabTitle',
    'tabIcon'
  ],
  host: {
    '[attr.id]': 'panelId',
    '[attr.aria-labelledby]': 'labeledBy',
    '[attr.aria-hidden]': 'isNotSelected',
    'role': 'tabpanel'
  }
})
@View({
  template: '<template content-anchor></template><ng-content></ng-content>',
  directives: [forwardRef(() => TabContentAnchor)]
})
export class Tab extends NavController {

  /**
   * TODO
   * @param {Tabs} tabs  TODO
   * @param {ElementRef} elementRef  TODO
   * @param {Injector} injector  TODO
   * @param {NgZone} zone  TODO
   */
  constructor(
    @Host() tabs: Tabs,
    app: IonicApp,
    config: IonicConfig,
    elementRef: ElementRef,
    compiler: Compiler,
    loader: DynamicComponentLoader,
    viewManager: AppViewManager,
    zone: NgZone
  ) {
    // A Tab is both a container of many pages, and is a page itself.
    // A Tab is one page within it's Host Tabs (which also extends NavController)
    // A Tab is a NavController for its child pages
    super(tabs, app, config, elementRef, compiler, loader, viewManager, zone);
    this.tabs = tabs;

    let viewCtrl = this.viewCtrl = new ViewController(tabs.Host);
    viewCtrl.setInstance(this);
    viewCtrl.viewElementRef(elementRef);
    this._initTab = tabs.addTab(this);

    this.navbarView = viewCtrl.navbarView = () => {
      let activeView = this.getActive();
      return activeView && activeView.navbarView();
    };

    viewCtrl.enableBack = () => {
      // override ViewController's enableBack(), should use the
      // active child nav item's enableBack() instead
      let activeView = this.getActive();
      return (activeView && activeView.enableBack());
    };

    this.panelId = 'tab-panel-' + viewCtrl.id;
    this.labeledBy = 'tab-button-' + viewCtrl.id;
  }

  onInit() {
    console.log('Tab onInit');

    if (this._initTab) {
      this.tabs.select(this);

    } else {
      // TODO: OPTIONAL PRELOAD OTHER TABS!
      // setTimeout(() => {
      //   this.load();
      // }, 300);
    }
  }

  load(callback) {
    if (!this._loaded && this.root) {
      let opts = {
        animate: false,
        navbar: false
      };
      this.push(this.root, null, opts).then(() => {
        callback && callback();
      });
      this._loaded = true;

    } else {
      callback && callback();
    }
  }

  get isSelected() {
    return this.tabs.isActive(this.viewCtrl);
  }

  get isNotSelected() {
    return !this.tabs.isActive(this.viewCtrl);
  }

  loadContainer(componentType, hostProtoViewRef, viewCtrl, done) {

    let viewComponetRef = this.createViewComponetRef(componentType, hostProtoViewRef, this.contentContainerRef, this.getBindings(viewCtrl));
    viewCtrl.disposals.push(() => {
      viewComponetRef.dispose();
    });

    // a new ComponentRef has been created
    // set the ComponentRef's instance to this ViewController
    viewCtrl.setInstance(viewComponetRef.instance);

    // remember the ElementRef to the content that was just created
    viewCtrl.viewElementRef(viewComponetRef.location);

    // get the NavController's container for navbars, which is
    // the place this NavController will add each ViewController's navbar
    let navbarContainerRef = this.tabs.navbarContainerRef;

    // get this ViewController's navbar TemplateRef, which may not
    // exist if the ViewController's template didn't have an <ion-navbar *navbar>
    let navbarTemplateRef = viewCtrl.getNavbarTemplateRef();

    // create the navbar view if the pane has a navbar container, and the
    // ViewController's instance has a navbar TemplateRef to go to inside of it
    if (navbarContainerRef && navbarTemplateRef) {
      let navbarView = navbarContainerRef.createEmbeddedView(navbarTemplateRef, -1);

      viewCtrl.disposals.push(() => {
        let index = navbarContainerRef.indexOf(navbarView);
        if (index > -1) {
          navbarContainerRef.remove(index);
        }
      });
    }

    done();
  }

}


@Directive({selector: 'template[content-anchor]'})
class TabContentAnchor {
  constructor(
    @Host() tab: Tab,
    viewContainerRef: ViewContainerRef
  ) {
    tab.contentContainerRef = viewContainerRef;
  }
}
