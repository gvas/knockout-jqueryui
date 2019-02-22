/*jshint strict: false */
/*global define*/
define(

    [
        './bindingHandler',
        './utils',
        'jquery-ui/menu'
    ],

    function (BindingHandler, utils) {

        var Menu = function () {
            /// <summary>Constructor.</summary>

            BindingHandler.call(this, 'menu');

            this.options = ['disabled', 'icons', 'menus', 'position', 'role'];
            if (utils.uiVersion.major === 1 && utils.uiVersion.minor === 11) {
                this.options.push('items');
            } else {
                this.options.push('items');
                this.options.push('classes');
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
