import * as util from 'ionic2/util';

class Platform {
  constructor(options) {
    util.extend(this, options);
  }
}

class PlatformController {
  current: Platform;
  constructor() {
    this.registry = [];
  }
  set(platform) {
    this.current = platform;
  }
  get() {
    return this.current;
  }
  register(platform) {
    if (!platform instanceof Platform) {
      platform = new Platform(platform);
    }
    this.registry.push(platform);
  }
  isRegistered(platformName) {
    return this.registry.some(platform => {
      return platform.name === platformName;
    });
  }
  detect() {
    for (let platform of this.registry) {
      if (platform.matcher()) {
        return platform;
      }
    }
  }
}

export let platform = new PlatformController();

// TODO(ajoslin): move this to a facade somewhere else?
var ua = window.navigator.userAgent;

// TODO(ajoslin): move these to their own files
platform.register({
  name: 'android',
  matcher() {
    //TODO Make a better override than window
    return window.IONIC_PLATFORM == 'android' || /android/i.test(ua);
  }
});
platform.register({
  name: 'ios',
  // For now always default to ios
  matcher() {
    return window.IONIC_PLATFORM === 'ios' || /ipad|iphone|ipod/i.test(ua);
  }
});

// Last case is a catch-all
platform.register({
  name: 'default',
  matcher() {
    return true;
  }
});


platform.set( platform.detect() );
