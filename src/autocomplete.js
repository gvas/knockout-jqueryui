/*global exports*/
(function () {

    'use strict';

    var Autocomplete = function () {
        /// <summary>Constructor.</summary>

        exports.BindingHandler.call(this, 'autocomplete');

        this.options = ['appendTo', 'autoFocus', 'delay', 'disabled', 'minLength',
            'position', 'source'];

        if (exports.utils.versions.jQueryUI.major === 1 &&
                exports.utils.versions.jQueryUI.minor === 8) {
            this.events = ['change', 'close', 'create', 'focus', 'open', 'search',
                'select'];
        } else {
            this.events = ['change', 'close', 'create', 'focus', 'open', 'response',
                'search', 'select'];
        }
    };

    Autocomplete.prototype = exports.utils.createObject(exports.BindingHandler.prototype);
    Autocomplete.prototype.constructor = Autocomplete;

    exports.Autocomplete = Autocomplete;

    exports.bindingHandlerRegistry.register(new Autocomplete());
}());