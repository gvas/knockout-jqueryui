/*global define*/
define(

    [
        './bindingHandler',
        './utils',
        'jquery-ui/progressbar'
    ],

    function (BindingHandler, utils, widget) {

        'use strict';

        var Progressbar = function () {
            /// <summary>Constructor.</summary>

            var version = utils.parseVersionString(widget.version);

            BindingHandler.call(this, 'progressbar');

            this.events = ['change', 'create', 'complete'];
            this.hasRefresh = true;

            if (version.major === 1 && version.minor === 8) {
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
