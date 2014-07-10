/*global define*/
define(

    [
        './bindingHandler',
        './utils',
        'jquery-ui/autocomplete'
    ],

    function (BindingHandler, utils, widget) {

        'use strict';

        var Autocomplete = function () {
            /// <summary>Constructor.</summary>

            var version = utils.parseVersionString(widget.version);

            BindingHandler.call(this, 'autocomplete');

            this.options = ['appendTo', 'autoFocus', 'delay', 'disabled', 'minLength',
                'position', 'source'];

            if (version.major === 1 && version.minor === 8) {
                this.events = ['change', 'close', 'create', 'focus', 'open', 'search',
                    'select'];
            } else {
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
