/*jshint strict: false */
/*global define*/
define(

    [
        './bindingHandler',
        './utils',
        'jquery-ui/button'
    ],

    function (BindingHandler, utils) {

        var Button = function () {
            /// <summary>Constructor.</summary>

            BindingHandler.call(this, 'button');

            this.options = ['disabled', 'label'];
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

        Button.prototype = utils.createObject(BindingHandler.prototype);
        Button.prototype.constructor = Button;

        utils.register(Button);

        return Button;
    }
);
