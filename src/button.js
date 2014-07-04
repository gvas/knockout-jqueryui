/*global exports*/
(function () {

    'use strict';

    var Button = function () {
        /// <summary>Constructor.</summary>

        exports.BindingHandler.call(this, 'button');

        this.options = ['disabled', 'icons', 'label', 'text'];
        this.events = ['create'];
        this.hasRefresh = true;
    };

    Button.prototype = exports.utils.createObject(exports.BindingHandler.prototype);
    Button.prototype.constructor = Button;

    exports.Button = Button;

    exports.bindingHandlerRegistry.register(new Button());
}());