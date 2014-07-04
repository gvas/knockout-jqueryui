/*global exports*/
(function () {

    'use strict';

    var Buttonset = function () {
        /// <summary>Constructor.</summary>

        exports.BindingHandler.call(this, 'buttonset');

        this.options = ['items', 'disabled'];
        this.events = ['create'];
        this.hasRefresh = true;
    };

    Buttonset.prototype = exports.utils.createObject(exports.BindingHandler.prototype);
    Buttonset.prototype.constructor = Buttonset;

    exports.Buttonset = Buttonset;

    exports.bindingHandlerRegistry.register(new Buttonset());
}());