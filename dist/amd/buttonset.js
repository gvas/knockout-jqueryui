/*global define*/
define(

    [
        './bindingHandler',
        './utils',
        'jquery-ui/button'
    ],

    function (BindingHandler, utils) {

        'use strict';

        var Buttonset = function () {
            /// <summary>Constructor.</summary>

            BindingHandler.call(this, 'buttonset');

            this.options = ['items', 'disabled'];
            this.events = ['create'];
            this.hasRefresh = true;
        };

        Buttonset.prototype = utils.createObject(BindingHandler.prototype);
        Buttonset.prototype.constructor = Buttonset;

        utils.register(Buttonset);

        return Buttonset;
    }
);
