/*global define*/
define(

    [
        './bindingHandler',
        './utils',
        'jquery-ui/menu'
    ],

    function (BindingHandler, utils, widget) {

        'use strict';

        var Menu = function () {
            /// <summary>Constructor.</summary>

            var version;

            BindingHandler.call(this, 'menu');

            if (widget) {
                version = utils.parseVersionString(widget.version);
            }

            if (version && version.major === 1 && version.minor < 11) {
                this.options = ['disabled', 'icons', 'menus', 'position', 'role'];
            } else {
                this.options = ['disabled', 'icons', 'items', 'menus', 'position',
                    'role'];
            }

            this.events = ['blur', 'create', 'focus', 'select'];
            this.hasRefresh = true;
        };

        Menu.prototype = utils.createObject(BindingHandler.prototype);
        Menu.prototype.constructor = Menu;

        utils.register(Menu);

        return Menu;
    }
);
