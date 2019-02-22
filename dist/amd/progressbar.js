/*jshint strict: false */
/*global define*/
define(

    [
        './bindingHandler',
        './utils',
        'jquery-ui/progressbar'
    ],

    function (BindingHandler, utils) {

        var Progressbar = function () {
            /// <summary>Constructor.</summary>

            BindingHandler.call(this, 'progressbar');

            this.options = ['disabled', 'value'];
            this.events = ['change', 'create', 'complete'];
            this.hasRefresh = true;

            if (utils.uiVersion.major === 1 && (utils.uiVersion.minor >= 9 && utils.uiVersion.minor <= 11)) {
                this.options.push('max');
            } else {
                this.options.push('max');
                this.options.push('classes');
            }
        };

        Progressbar.prototype = utils.createObject(BindingHandler.prototype);
        Progressbar.prototype.constructor = Progressbar;

        utils.register(Progressbar);

        return Progressbar;
    }
);
