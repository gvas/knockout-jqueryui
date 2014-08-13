/*global define*/
define(

    [
        './bindingHandler',
        './utils',
        'jquery-ui/autocomplete'
    ],

    function (BindingHandler, utils) {

        'use strict';

        var Autocomplete = function () {
            /// <summary>Constructor.</summary>

            BindingHandler.call(this, 'autocomplete');

            this.options = ['appendTo', 'autoFocus', 'delay', 'disabled', 'minLength',
                'position', 'source'];

            if (utils.uiVersion.major === 1 && utils.uiVersion.minor === 8) {
                this.events = ['change', 'close', 'create', 'focus', 'open', 'search',
                    'select'];
            } else {
                this.options.push('messages');
                this.events = ['change', 'close', 'create', 'focus', 'open', 'response',
                    'search', 'select'];
            }
        };

        Autocomplete.prototype = utils.createObject(BindingHandler.prototype);
        Autocomplete.prototype.constructor = Autocomplete;

        utils.register(Autocomplete);

        return Autocomplete;
    }
);
