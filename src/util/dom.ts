
export function getCss(docEle: HTMLElement) {
  const css: {
    transform?: string;
    transition?: string;
    transitionDuration?: string;
    transitionDelay?: string;
    transitionTimingFn?: string;
    transitionStart?: string;
    transitionEnd?: string;
    transformOrigin?: string;
    animationDelay?: string;
  } = {};

  // transform
  var i: number;
  var keys = ['webkitTransform', '-webkit-transform', 'webkit-transform', 'transform'];

  for (i = 0; i < keys.length; i++) {
    if ((<any>docEle.style)[keys[i]] !== undefined) {
      css.transform = keys[i];
      break;
    }
  }

  // transition
  keys = ['webkitTransition', 'transition'];
  for (i = 0; i < keys.length; i++) {
    if ((<any>docEle.style)[keys[i]] !== undefined) {
      css.transition = keys[i];
      break;
    }
  }

  // The only prefix we care about is webkit for transitions.
  var isWebkit = css.transition.indexOf('webkit') > -1;

  // transition duration
  css.transitionDuration = (isWebkit ? '-webkit-' : '') + 'transition-duration';

  // transition timing function
  css.transitionTimingFn = (isWebkit ? '-webkit-' : '') + 'transition-timing-function';

  // transition delay
  css.transitionDelay = (isWebkit ? '-webkit-' : '') + 'transition-delay';

  // To be sure transitionend works everywhere, include *both* the webkit and non-webkit events
  css.transitionEnd = (isWebkit ? 'webkitTransitionEnd ' : '') + 'transitionend';

  // transform origin
  css.transformOrigin = (isWebkit ? '-webkit-' : '') + 'transform-origin';

  // animation delay
  css.animationDelay = (isWebkit ? 'webkitAnimationDelay' : 'animationDelay');

  return css;
}


export function pointerCoord(ev: any): PointerCoordinates {
  // get coordinates for either a mouse click
  // or a touch depending on the given event
  if (ev) {
    var changedTouches = ev.changedTouches;
    if (changedTouches && changedTouches.length > 0) {
      var touch = changedTouches[0];
      return { x: touch.clientX, y: touch.clientY };
    }
    var pageX = ev.pageX;
    if (pageX !== undefined) {
      return { x: pageX, y: ev.pageY };
    }
  }
  return { x: 0, y: 0 };
}

export function hasPointerMoved(threshold: number, startCoord: PointerCoordinates, endCoord: PointerCoordinates) {
  if (startCoord && endCoord) {
    const deltaX = (startCoord.x - endCoord.x);
    const deltaY = (startCoord.y - endCoord.y);
    const distance = deltaX * deltaX + deltaY * deltaY;
    return distance > (threshold * threshold);
  }
  return false;
}

export function isTextInput(ele: any) {
  return !!ele &&
         (ele.tagName === 'TEXTAREA' ||
          ele.contentEditable === 'true' ||
          (ele.tagName === 'INPUT' && !(NON_TEXT_INPUT_REGEX.test(ele.type))));
}

export const NON_TEXT_INPUT_REGEX = /^(radio|checkbox|range|file|submit|reset|color|image|button)$/i;


const skipInputAttrsReg = /^(value|checked|disabled|type|class|style|id|autofocus|autocomplete|autocorrect)$/i;
export function copyInputAttributes(srcElement: HTMLElement, destElement: HTMLElement) {
  // copy attributes from one element to another
  // however, skip over a few of them as they're already
  // handled in the angular world
  var attrs = srcElement.attributes;
  for (var i = 0; i < attrs.length; i++) {
    var attr = attrs[i];
    if (!skipInputAttrsReg.test(attr.name)) {
      destElement.setAttribute(attr.name, attr.value);
    }
  }
}


export interface PointerCoordinates {
  x?: number;
  y?: number;
}



export function pointerCoordX(ev: any): number {
  // get X coordinates for either a mouse click
  // or a touch depending on the given event
  if (ev) {
    var changedTouches = ev.changedTouches;
    if (changedTouches && changedTouches.length > 0) {
      return changedTouches[0].clientX;
    }
    if (ev.pageX !== undefined) {
      return ev.pageX;
    }
  }
  return 0;
}


export function pointerCoordY(ev: any): number {
  // get Y coordinates for either a mouse click
  // or a touch depending on the given event
  if (ev) {
    var changedTouches = ev.changedTouches;
    if (changedTouches && changedTouches.length > 0) {
      return changedTouches[0].clientY;
    }
    if (ev.pageY !== undefined) {
      return ev.pageY;
    }
  }
  return 0;
}


export function getElementReference(elm: any, ref: string) {
  if (ref === 'child') {
    return elm.firstElementChild;
  }
  if (ref === 'parent') {
    if (elm.parentElement ) {
      // normal element with a parent element
      return elm.parentElement;
    }
    if (elm.parentNode && elm.parentNode.host) {
      // shadow dom's document fragment
      return elm.parentNode.host;
    }
  }
  if (ref === 'body') {
    return elm.ownerDocument.body;
  }
  if (ref === 'document') {
    return elm.ownerDocument;
  }
  if (ref === 'window') {
    return elm.ownerDocument.defaultView;
  }
  return elm;
}


export function getKeyCodeByName(keyName: string) {
  if (keyName === 'enter') {
    return 13;
  }
  if (keyName === 'escape') {
    return 27;
  }
  if (keyName === 'space') {
    return 32;
  }
  if (keyName === 'tab') {
    return 9;
  }
  return null;
}


export function applyStyles(elm: HTMLElement, styles: {[styleProp: string]: string|number}) {
  const styleProps = Object.keys(styles);

  for (var i = 0; i < styleProps.length; i++) {
    (<any>elm.style)[styleProps[i]] = styles[styleProps[i]];
  }
}
