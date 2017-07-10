/*! Built with http://stenciljs.com */

(function (window, document, projectNamespace, projectFileName, projectCore, projectCoreEs5, components) {
    'use strict';
    // create global namespace if it doesn't already exist

    var Project = window[projectNamespace] = window[projectNamespace] || {};
    Project.components = Project.components || components;
    Project.ns = projectNamespace;
    // find the static directory, which should be the same as this JS file
    // reusing the "x" and "y" variables for funzies
    var x = document.getElementsByTagName('script');
    x = x[x.length - 1];
    var y = document.querySelector('script[data-static-dir]');
    if (y) {
        Project.staticDir = y.dataset['staticDir'];
    } else {
        y = x.src.split('/');
        y.pop();
        Project.staticDir = x.dataset['staticDir'] = y.join('/') + '/';
    }
    Project.staticDir += projectFileName + '/';
    // auto hide components until they been fully hydrated
    x = document.createElement('style');
    x.innerHTML = Project.components.map(function (c) {
        return c[0];
    }).join(',') + '{visibility:hidden}.hydrated{visibility:inherit}';
    x.innerHTML += 'ion-app:not(.hydrated){display:none}';
    document.head.appendChild(x);
    // request the core file this browser needs
    y = document.createElement('script');
    y.src = Project.staticDir + (window.customElements ? projectCore : projectCoreEs5);
    document.head.appendChild(y);
    // performance.now() polyfill
    if ('performance' in window === false) {
        window.performance = {};
    }
    if ('now' in performance === false) {
        var navStart = Date.now();
        performance.now = function () {
            return Date.now() - navStart;
        };
    }
})(window, document, "App","app","app.core.js","app.core.ce.js",[["COMMENTS-LIST","comments-list.comments-page.news-container.news-li",{"$":"comments-list.comments-page.news-container.news-li"},0,[["type"]]],["COMMENTS-PAGE","comments-list.comments-page.news-container.news-li",{"$":"comments-list.comments-page.news-container.news-li"},0,[["comments"]]],["ION-APP","ion-app.ion-content.ion-footer.ion-header.ion-navb",{"ios":"ios.ion-app.ion-content.ion-footer.ion-header.ion-","md":"md.ion-app.ion-content.ion-footer.ion-header.ion-n","wp":"wp.ion-app.ion-content.ion-footer.ion-header.ion-n"},1],["ION-AVATAR","ion-avatar.ion-badge.ion-thumbnail",{"ios":"ios.ion-avatar.ion-badge.ion-thumbnail","md":"md.ion-avatar.ion-badge.ion-thumbnail","wp":"wp.ion-avatar.ion-badge.ion-thumbnail"},1],["ION-BADGE","ion-avatar.ion-badge.ion-thumbnail",{"ios":"ios.ion-avatar.ion-badge.ion-thumbnail","md":"md.ion-avatar.ion-badge.ion-thumbnail","wp":"wp.ion-avatar.ion-badge.ion-thumbnail"},1],["ION-BUTTON","ion-button.ion-buttons.ion-icon",{"ios":"ios.ion-button.ion-buttons.ion-icon","md":"md.ion-button.ion-buttons.ion-icon","wp":"wp.ion-button.ion-buttons.ion-icon"},2,[["block",0,1],["buttonType"],["clear",0,1],["color"],["default",0,1],["disabled",0,1],["full",0,1],["href"],["itemButton",0,1],["large",0,1],["mode"],["outline",0,1],["round",0,1],["small",0,1],["solid",0,1],["strong",0,1]]],["ION-BUTTONS","ion-button.ion-buttons.ion-icon",{"ios":"ios.ion-button.ion-buttons.ion-icon","md":"md.ion-button.ion-buttons.ion-icon","wp":"wp.ion-button.ion-buttons.ion-icon"},1],["ION-CARD","ion-card.ion-card-content.ion-card-header.ion-card",{"ios":"ios.ion-card.ion-card-content.ion-card-header.ion-","md":"md.ion-card.ion-card-content.ion-card-header.ion-c","wp":"wp.ion-card.ion-card-content.ion-card-header.ion-c"},1],["ION-CARD-CONTENT","ion-card.ion-card-content.ion-card-header.ion-card",{"ios":"ios.ion-card.ion-card-content.ion-card-header.ion-","md":"md.ion-card.ion-card-content.ion-card-header.ion-c","wp":"wp.ion-card.ion-card-content.ion-card-header.ion-c"},1],["ION-CARD-HEADER","ion-card.ion-card-content.ion-card-header.ion-card",{"ios":"ios.ion-card.ion-card-content.ion-card-header.ion-","md":"md.ion-card.ion-card-content.ion-card-header.ion-c","wp":"wp.ion-card.ion-card-content.ion-card-header.ion-c"},1],["ION-CARD-TITLE","ion-card.ion-card-content.ion-card-header.ion-card",{"ios":"ios.ion-card.ion-card-content.ion-card-header.ion-","md":"md.ion-card.ion-card-content.ion-card-header.ion-c","wp":"wp.ion-card.ion-card-content.ion-card-header.ion-c"},1],["ION-CONTENT","ion-app.ion-content.ion-footer.ion-header.ion-navb",{"ios":"ios.ion-app.ion-content.ion-footer.ion-header.ion-","md":"md.ion-app.ion-content.ion-footer.ion-header.ion-n","wp":"wp.ion-app.ion-content.ion-footer.ion-header.ion-n"},1,[["fullscreen",0,1],["ionScroll"],["ionScrollEnd"],["ionScrollStart"]]],["ION-FOOTER","ion-app.ion-content.ion-footer.ion-header.ion-navb",{"ios":"ios.ion-app.ion-content.ion-footer.ion-header.ion-","md":"md.ion-app.ion-content.ion-footer.ion-header.ion-n","wp":"wp.ion-app.ion-content.ion-footer.ion-header.ion-n"},1],["ION-GESTURE","ion-gesture.ion-scroll",{},0,[["attachTo"],["autoBlockAll",0,1],["block"],["canStart"],["direction"],["disableScroll",0,1],["gestureName"],["gesturePriority",0,2],["maxAngle",0,2],["notCaptured"],["onEnd"],["onMove"],["onPress"],["onStart"],["threshold",0,2],["type"]]],["ION-HEADER","ion-app.ion-content.ion-footer.ion-header.ion-navb",{"ios":"ios.ion-app.ion-content.ion-footer.ion-header.ion-","md":"md.ion-app.ion-content.ion-footer.ion-header.ion-n","wp":"wp.ion-app.ion-content.ion-footer.ion-header.ion-n"},1],["ION-ICON","ion-button.ion-buttons.ion-icon",{"ios":"ios.ion-button.ion-buttons.ion-icon","md":"md.ion-button.ion-buttons.ion-icon","wp":"wp.ion-button.ion-buttons.ion-icon"},1,[["color"],["hidden",0,1],["ios"],["isActive",0,1],["md"],["name"]]],["ION-ITEM","ion-item.ion-item-divider.ion-label.ion-list.ion-l",{"$":"ion-item.ion-item-divider.ion-label.ion-list.ion-l","ios":"ios.ion-item.ion-item-divider.ion-label.ion-list.i","md":"md.ion-item.ion-item-divider.ion-label.ion-list.io","wp":"wp.ion-item.ion-item-divider.ion-label.ion-list.io"},2,[["color"],["mode"]]],["ION-ITEM-DIVIDER","ion-item.ion-item-divider.ion-label.ion-list.ion-l",{"$":"ion-item.ion-item-divider.ion-label.ion-list.ion-l","ios":"ios.ion-item.ion-item-divider.ion-label.ion-list.i","md":"md.ion-item.ion-item-divider.ion-label.ion-list.io","wp":"wp.ion-item.ion-item-divider.ion-label.ion-list.io"},2],["ION-LABEL","ion-item.ion-item-divider.ion-label.ion-list.ion-l",{"$":"ion-item.ion-item-divider.ion-label.ion-list.ion-l","ios":"ios.ion-item.ion-item-divider.ion-label.ion-list.i","md":"md.ion-item.ion-item-divider.ion-label.ion-list.io","wp":"wp.ion-item.ion-item-divider.ion-label.ion-list.io"},1],["ION-LIST","ion-item.ion-item-divider.ion-label.ion-list.ion-l",{"$":"ion-item.ion-item-divider.ion-label.ion-list.ion-l","ios":"ios.ion-item.ion-item-divider.ion-label.ion-list.i","md":"md.ion-item.ion-item-divider.ion-label.ion-list.io","wp":"wp.ion-item.ion-item-divider.ion-label.ion-list.io"},1],["ION-LIST-HEADER","ion-item.ion-item-divider.ion-label.ion-list.ion-l",{"$":"ion-item.ion-item-divider.ion-label.ion-list.ion-l","ios":"ios.ion-item.ion-item-divider.ion-label.ion-list.i","md":"md.ion-item.ion-item-divider.ion-label.ion-list.io","wp":"wp.ion-item.ion-item-divider.ion-label.ion-list.io"},1],["ION-LOADING","ion-loading.ion-loading-controller",{"$":"ion-loading.ion-loading-controller","ios":"ios.ion-loading.ion-loading-controller","md":"md.ion-loading.ion-loading-controller","wp":"wp.ion-loading.ion-loading-controller"},0,[["content"],["cssClass"],["dismissOnPageChange",0,1],["duration",0,2],["enterAnimation"],["exitAnimation"],["id"],["showBackdrop",0,1]]],["ION-LOADING-CONTROLLER","ion-loading.ion-loading-controller",{"$":"ion-loading.ion-loading-controller","ios":"ios.ion-loading.ion-loading-controller","md":"md.ion-loading.ion-loading-controller","wp":"wp.ion-loading.ion-loading-controller"}],["ION-MENU","ion-menu",{"ios":"ios.ion-menu","md":"md.ion-menu","wp":"wp.ion-menu"},1,[["content"],["enabled",0,1],["id"],["isAnimating",0,1],["isOpen",0,1],["maxEdgeStart",0,2],["persistent",0,1],["side"],["swipeEnabled",0,1],["type"]]],["ION-MODAL","ion-modal.ion-modal-controller",{"$":"ion-modal.ion-modal-controller","ios":"ios.ion-modal.ion-modal-controller","md":"md.ion-modal.ion-modal-controller","wp":"wp.ion-modal.ion-modal-controller"},0,[["color"],["component"],["componentProps"],["cssClass"],["enableBackdropDismiss",0,1],["enterAnimation"],["exitAnimation"],["id"],["mode"],["showBackdrop",0,1]]],["ION-MODAL-CONTROLLER","ion-modal.ion-modal-controller",{"$":"ion-modal.ion-modal-controller","ios":"ios.ion-modal.ion-modal-controller","md":"md.ion-modal.ion-modal-controller","wp":"wp.ion-modal.ion-modal-controller"}],["ION-NAVBAR","ion-app.ion-content.ion-footer.ion-header.ion-navb",{"ios":"ios.ion-app.ion-content.ion-footer.ion-header.ion-","md":"md.ion-app.ion-content.ion-footer.ion-header.ion-n","wp":"wp.ion-app.ion-content.ion-footer.ion-header.ion-n"},2,[["backButtonIcon"],["backButtonText"],["hidden",0,1],["hideBackButton",0,1]]],["ION-PAGE","ion-app.ion-content.ion-footer.ion-header.ion-navb",{"ios":"ios.ion-app.ion-content.ion-footer.ion-header.ion-","md":"md.ion-app.ion-content.ion-footer.ion-header.ion-n","wp":"wp.ion-app.ion-content.ion-footer.ion-header.ion-n"},1],["ION-SCROLL","ion-gesture.ion-scroll",{},1,[["enabled",0,1],["ionScroll"],["ionScrollEnd"],["ionScrollStart"],["jsScroll",0,1]]],["ION-SEARCHBAR","ion-searchbar",{"ios":"ios.ion-searchbar","md":"md.ion-searchbar","wp":"wp.ion-searchbar"},0,[["animated",0,1,1],["autocomplete",0,0,1],["autocorrect",0,0,1],["cancelButtonText",0,0,1],["color"],["debounce",0,2,1],["mode"],["placeholder",0,0,1],["showCancelButton",0,1,1],["spellcheck",0,1,1],["type",0,0,1],["value",0,0,1]]],["ION-SEGMENT","ion-segment.ion-segment-button",{"ios":"ios.ion-segment.ion-segment-button","md":"md.ion-segment.ion-segment-button","wp":"wp.ion-segment.ion-segment-button"},1,[["disabled",0,1,1],["value",0,0,1]]],["ION-SEGMENT-BUTTON","ion-segment.ion-segment-button",{"ios":"ios.ion-segment.ion-segment-button","md":"md.ion-segment.ion-segment-button","wp":"wp.ion-segment.ion-segment-button"},1,[["checked",0,1,1],["disabled",0,1,1],["value",0,0,1]]],["ION-SKELETON-TEXT","ion-item.ion-item-divider.ion-label.ion-list.ion-l",{"$":"ion-item.ion-item-divider.ion-label.ion-list.ion-l","ios":"ios.ion-item.ion-item-divider.ion-label.ion-list.i","md":"md.ion-item.ion-item-divider.ion-label.ion-list.io","wp":"wp.ion-item.ion-item-divider.ion-label.ion-list.io"},0,[["width"]]],["ION-SLIDE","ion-slide.ion-slides",{"$":"ion-slide.ion-slides"},1],["ION-SLIDES","ion-slide.ion-slides",{"$":"ion-slide.ion-slides"},1,[["autoplay",0,2],["control"],["direction"],["effect"],["initialSlide",0,2],["keyboardControl",0,1],["loop",0,1],["pager",0,1],["paginationType"],["parallax",0,1],["slidesPerView"],["spaceBetween",0,2],["speed",0,2],["zoom",0,1]]],["ION-SPINNER","ion-spinner",{"ios":"ios.ion-spinner","md":"md.ion-spinner","wp":"wp.ion-spinner"},0,[["color"],["duration",0,2],["mode"],["name"],["paused",0,1]]],["ION-THUMBNAIL","ion-avatar.ion-badge.ion-thumbnail",{"ios":"ios.ion-avatar.ion-badge.ion-thumbnail","md":"md.ion-avatar.ion-badge.ion-thumbnail","wp":"wp.ion-avatar.ion-badge.ion-thumbnail"},1],["ION-TITLE","ion-app.ion-content.ion-footer.ion-header.ion-navb",{"ios":"ios.ion-app.ion-content.ion-footer.ion-header.ion-","md":"md.ion-app.ion-content.ion-footer.ion-header.ion-n","wp":"wp.ion-app.ion-content.ion-footer.ion-header.ion-n"},1],["ION-TOGGLE","ion-toggle",{"ios":"ios.ion-toggle","md":"md.ion-toggle","wp":"wp.ion-toggle"},0,[["checked",0,1,1],["color"],["disabled",0,1,1],["mode"],["value",0,0,1]]],["ION-TOOLBAR","ion-app.ion-content.ion-footer.ion-header.ion-navb",{"ios":"ios.ion-app.ion-content.ion-footer.ion-header.ion-","md":"md.ion-app.ion-content.ion-footer.ion-header.ion-n","wp":"wp.ion-app.ion-content.ion-footer.ion-header.ion-n"},2],["NEWS-CONTAINER","comments-list.comments-page.news-container.news-li",{"$":"comments-list.comments-page.news-container.news-li"}],["NEWS-LIST","comments-list.comments-page.news-container.news-li",{"$":"comments-list.comments-page.news-container.news-li"},0,[["type"]]]]);