/**
 * Overlay is used to mask the screen while a dialog prompt out
*/
function Overlay(option) {
    var option = option || {};
    $overlayHandle = null; // Handle of html element
    var defaultClassName = null; // Default css class name

    if (option.className) {
        defaultClassName = option.className;
    }

    this.getClassName = function () {
        return defaultClassName;
    }

    this.setClassName = function (className) {
        defaultClassName = className;
    }

    var style = {
        "position": "fixed",
        "top": 0,
        "left": 0,
        "right": 0,
        "bottom": 0,
        "background": "none repeat scroll 0% 0% black",
        "opacity": 0.4,
        "filter": "alpha(opacity=40)",
        "cursor": "pointer",
        "z-index": 1
    };

    var customClickEven = null;
    if (option.click && typeof(option.click) == "function") {
        customClickEven = option.click;
    }
    var that = this;
    var clickEvent = function (evt) {
        if (typeof(customClickEven) == "function") {
            customClickEven(evt);
        }

        that.hide();
    }

    this.css = function (css) {
        if (arguments.length < 1) {
            // It return style while no param pass-in
            return style;
        }

        Object.keys(css).forEach(function (key) {
            if (key == "position") return;
            if (key == "top") return;
            if (key == "left") return;
            if (key == "right") return;
            if (key == "bottom") return;
            style[key] = css[key];
        });
    }
    if (option.css) {
        this.css(option.css);
    }

    this.show = function (option){
        var option = option || {};
        if(!$overlayHandle) {
            $overlayHandle = $("<div></div>");
        }

        if (option.css) {
            this.css(option.css);
        }

        $overlayHandle.css(style);
        if (option.className) {
            this.setClassName(option.className);
        }
        if (defaultClassName) $overlayHandle.addClass(defaultClassName);
        if (option.click && typeof(option.click) == "function") {
            customClickEven = option.click;
        }
        $overlayHandle.click(clickEvent);
        $("body").append($overlayHandle);
    }

    this.hide = function () {
        if ($overlayHandle) {
            $overlayHandle.hide();
            $overlayHandle.remove();
        }
        $overlayHandle = null;
    }

    this.isShown = function () {
        if ($overlayHandle) {
            return true;
        }
        return false;
    }

    this.toggle = function (option) {
        var option = option || {};
        if(this.isShown()) {
            this.hide();
        } else {
            this.show(option);
        }
    }
}