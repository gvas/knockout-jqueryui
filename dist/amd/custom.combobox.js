/*jshint strict: false */
/*global define*/
define(

    [
        './bindingHandler',
        './utils',
        'jquery-ui/autocomplete',
		'jquery-ui/button',
		'jquery-ui/tooltip'
    ],

    function (BindingHandler, utils) {

        var CustomCombobox = function () {
            /// <summary>Constructor.</summary>

            BindingHandler.call(this, 'combobox');

            this.options = ['removeIfInvalid', 'buttonTooltip'];
            this.events = [];
        };

        CustomCombobox.prototype = utils.createObject(BindingHandler.prototype);
        CustomCombobox.prototype.constructor = CustomCombobox;

        utils.register(CustomCombobox);

        return CustomCombobox;
    }
);
