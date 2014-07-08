/*global define*/
define(

    [
        './bindingHandler',
        './utils',
        'jquery-ui/menu'
    ],

    function (BindingHandler, utils) {

        'use strict';

        var Menu = function () {
            /// <summary>Constructor.</summary>

            BindingHandler.call(this, 'menu');

            this.options = ['disabled', 'icons', 'menus', 'position', 'role'];
            this.events = ['blur', 'create', 'focus', 'select'];
            this.hasRefresh = true;
        };

        Menu.prototype = utils.createObject(BindingHandler.prototype);
        Menu.prototype.constructor = Menu;

        utils.register(Menu);

        return Menu;
    }
);
