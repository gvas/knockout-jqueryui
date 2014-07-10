/*global define*/
define(

    [
        './bindingHandler',
        './utils',
        'jquery-ui/button'
    ],

    function (BindingHandler, utils) {

        'use strict';

        var Button = function () {
            /// <summary>Constructor.</summary>

            BindingHandler.call(this, 'button');

            this.options = ['disabled', 'icons', 'label', 'text'];
            this.events = ['create'];
            this.hasRefresh = true;
        };

        Button.prototype = utils.createObject(BindingHandler.prototype);
        Button.prototype.constructor = Button;

        utils.register(Button);

        return Button;
    }
);
