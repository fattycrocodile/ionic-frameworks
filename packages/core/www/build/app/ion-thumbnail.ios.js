/*! Built with http://stenciljs.com */
const { h, Context } = window.App;

class Thumbnail {
    render() {
        return h("slot", null);
    }
    static get is() { return "ion-thumbnail"; }
    static get host() { return { "theme": "thumbnail" }; }
    static get style() { return "ion-thumbnail {\n  display: block;\n}\n\nion-thumbnail img {\n  width: 100%;\n  height: 100%;\n}\n\n.thumbnail-ios {\n  border-radius: 0;\n  width: 48px;\n  height: 48px;\n}\n\n.thumbnail-ios ion-img,\n.thumbnail-ios img {\n  border-radius: 0;\n  overflow: hidden;\n}"; }
    static get styleMode() { return "ios"; }
}

export { Thumbnail as IonThumbnail };
