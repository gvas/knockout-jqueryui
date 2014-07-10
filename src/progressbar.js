/*global define*/
define(

    [
        './bindingHandler',
        './utils',
        'jquery-ui/progressbar'
    ],

    function (BindingHandler, utils) {

        'use strict';

        var Progressbar = function () {
            /// <summary>Constructor.</summary>

            BindingHandler.call(this, 'progressbar');

            this.events = ['change', 'create', 'complete'];
            this.hasRefresh = true;

            if (utils.uiVersion.major === 1 && utils.uiVersion.minor === 8) {
                this.options = ['disabled', 'value'];
            } else {
                this.options = ['disabled', 'max', 'value'];
            }
        };

        Progressbar.prototype = utils.createObject(BindingHandler.prototype);
        Progressbar.prototype.constructor = Progressbar;

        utils.register(Progressbar);

        return Progressbar;
    }
);
