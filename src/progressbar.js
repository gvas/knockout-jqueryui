/*global exports*/
(function () {

    'use strict';

    var Progressbar = function () {
        /// <summary>Constructor.</summary>

        exports.BindingHandler.call(this, 'progressbar');

        this.events = ['change', 'create', 'complete'];
        this.hasRefresh = true;

        if (exports.utils.versions.jQueryUI.major === 1 &&
                exports.utils.versions.jQueryUI.minor === 8) {
            this.options = ['disabled', 'value'];
        } else {
            this.options = ['disabled', 'max', 'value'];
        }
    };

    Progressbar.prototype = exports.utils.createObject(exports.BindingHandler.prototype);
    Progressbar.prototype.constructor = Progressbar;

    exports.Progressbar = Progressbar;

    exports.bindingHandlerRegistry.register(new Progressbar());
}());