/*global define*/
define(

    [
        'jquery',
        'knockout',
        './bindingHandler',
        './utils',
        'jquery-ui/spinner'
    ],

    function ($, ko, BindingHandler, utils) {

        'use strict';

        var Spinner = function () {
            /// <summary>Constructor.</summary>

            BindingHandler.call(this, 'spinner');

            this.widgetEventPrefix = 'spin';
            this.options = ['culture', 'disabled', 'icons', 'incremental', 'max', 'min',
                'numberFormat', 'page', 'step'];
            this.events = ['create', 'start', 'spin', 'stop', 'change'];
        };

        Spinner.prototype = utils.createObject(BindingHandler.prototype);
        Spinner.prototype.constructor = Spinner;

        Spinner.prototype.init = function (element, valueAccessor) {
            /// <summary>Keeps the value binding property in sync with the spinner's
            /// value.</summary>
            /// <param name='element' type='DOMNode'></param>
            /// <param name='valueAccessor' type='Function'></param>
            /// <param name='allBindingsAccessor' type='Function'></param>

            var result, widgetName, value;

            result = BindingHandler.prototype.init.apply(this, arguments);

            widgetName = this.widgetName;
            value = valueAccessor();

            if (value.value) {
                ko.computed({
                    read: function () {
                        $(element)[widgetName]('value',
                            ko.utils.unwrapObservable(value.value));
                    },
                    disposeWhenNodeIsRemoved: element
                });
            }

            if (ko.isWriteableObservable(value.value)) {
                // The spin event is raised immediately when the value is changed with the
                // up/down buttons, while the change event is raised when the value is set
                // via the widget's value() method. Let's listen to both events.

                /*jslint unparam:true*/
                this.on(element, 'spin', function (ev, ui) {
                    value.value(ui.value);
                });
                /*jslint unparam:false*/

                this.on(element, 'change', function () {
                    value.value($(element)[widgetName]('value'));
                });
            }

            return result;
        };

        utils.register(Spinner);

        return Spinner;
    }
);
