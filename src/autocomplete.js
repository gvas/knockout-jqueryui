/*jshint strict: false */
/*global define*/
define(

    [
        './bindingHandler',
        './utils',
        'jquery-ui/autocomplete'
    ],

    function (BindingHandler, utils) {

        var Autocomplete = function () {
            /// <summary>Constructor.</summary>

            BindingHandler.call(this, 'autocomplete');

            this.options = ['appendTo', 'autoFocus', 'delay', 'disabled', 'minLength',
                'position', 'source'];
            this.events = ['change', 'close', 'create', 'focus', 'open', 'search',
                'select'];

            if (utils.uiVersion.major === 1 && (utils.uiVersion.minor >= 9 && utils.uiVersion.minor <= 11)) {
                this.events.push('response');
                this.options.push('messages');
            } else {
                this.events.push('response');
                this.options.push('messages');
                this.options.push('classes');
                
            }
        };

        Autocomplete.prototype = utils.createObject(BindingHandler.prototype);
        Autocomplete.prototype.constructor = Autocomplete;

        utils.register(Autocomplete);

        return Autocomplete;
    }
);
