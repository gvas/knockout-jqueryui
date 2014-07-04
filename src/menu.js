/*global exports*/
(function () {

    'use strict';

    var Menu = function () {
        /// <summary>Constructor.</summary>

        exports.BindingHandler.call(this, 'menu');

        this.options = ['disabled', 'icons', 'menus', 'position', 'role'];
        this.events = ['blur', 'create', 'focus', 'select'];
        this.hasRefresh = true;
    };

    Menu.prototype = exports.utils.createObject(exports.BindingHandler.prototype);
    Menu.prototype.constructor = Menu;

    exports.Menu = Menu;

    exports.bindingHandlerRegistry.register(new Menu());
}());