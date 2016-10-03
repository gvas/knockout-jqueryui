/*jshint strict: false */
/*global define*/
define(

    [
        './bindingHandler',
        './utils',
        'jquery-ui/checkboxradio'
    ],

    function (BindingHandler, utils) {

        var Checkboxradio = function () {
            /// <summary>Constructor.</summary>

            BindingHandler.call(this, 'checkboxradio');

            this.options = ['classes', 'disabled', 'icon', 'label'];
            this.events = ['create'];
            if (utils.uiVersion.major === 1 && (utils.uiVersion.minor >= 8 && utils.uiVersion.minor <= 11)) {
                this.options.push('icons');
                this.options.push('text');
            } else {
                this.options.push('classes');
                this.options.push('icon');
                this.options.push('iconPosition');
                this.options.push('showLabel');
            }
            this.hasRefresh = true;
        };

        Checkboxradio.prototype = utils.createObject(BindingHandler.prototype);
        Checkboxradio.prototype.constructor = Checkboxradio;

        utils.register(Checkboxradio);

        return Checkboxradio;
    }
);
