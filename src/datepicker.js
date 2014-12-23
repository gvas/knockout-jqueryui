/*global define*/
define(

    [
        'jquery',
        'knockout',
        './bindingHandler',
        './utils',
        'jquery-ui/datepicker'
    ],

    function ($, ko, BindingHandler, utils) {

        'use strict';

        var Datepicker = function () {
            /// <summary>Constructor.</summary>

            BindingHandler.call(this, 'datepicker');

            this.options = ['altField', 'altFormat', 'appendText', 'autoSize',
                'buttonImage', 'buttonImageOnly', 'buttonText', 'calculateWeek',
                'changeMonth', 'changeYear', 'closeText', 'constrainInput', 'currentText',
                'dateFormat', 'dayNames', 'dayNamesMin', 'dayNamesShort', 'defaultDate',
                'duration', 'firstDay', 'gotoCurrent', 'hideIfNoPrevNext', 'isRTL',
                'maxDate', 'minDate', 'monthNames', 'monthNamesShort',
                'navigationAsDateFormat', 'nextText', 'numberOfMonths', 'prevText',
                'selectOtherMonths', 'shortYearCutoff', 'showAnim', 'showButtonPanel',
                'showCurrentAtPos', 'showMonthAfterYear', 'showOn', 'showOptions',
                'showOtherMonths', 'showWeek', 'stepMonths', 'weekHeader', 'yearRange',
                'yearSuffix', 'beforeShow', 'beforeShowDay', 'onChangeMonthYear',
                'onClose', 'onSelect'];
            this.hasRefresh = true;
        };

        Datepicker.prototype = utils.createObject(BindingHandler.prototype);
        Datepicker.prototype.constructor = Datepicker;

        Datepicker.prototype.init = function (element, valueAccessor) {
            /// <summary>Keeps the value binding property in sync with the widget's state.
            /// </summary>
            /// <param name='element' type='DOMNode'></param>
            /// <param name='valueAccessor' type='Function'></param>
            /// <returns type='Object'></returns>

            var result, widgetName, options, value, subscription, origOnSelect;

            result = BindingHandler.prototype.init.apply(this, arguments);

            widgetName = this.widgetName;
            options = valueAccessor();
            value = ko.utils.unwrapObservable(options.value);

            if (value) {
                $(element)[widgetName]('setDate', value);
            }

            if (ko.isObservable(options.value)) {
                subscription = options.value.subscribe(function (newValue) {
                    $(element)[widgetName]('setDate', newValue);
                });

                ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
                    subscription.dispose();
                });
            }

            if (ko.isWriteableObservable(options.value)) {
                origOnSelect = $(element)[widgetName]('option', 'onSelect');
                $(element)[widgetName]('option', 'onSelect', function (selectedText) {
                    var format, date;

                    format = $(element)[widgetName]('option', 'dateFormat');
                    date = $.datepicker.parseDate(format, selectedText);
                    options.value(date);

                    if (typeof origOnSelect === 'function') {
                        origOnSelect.apply(this, Array.prototype.slice.call(arguments));
                    }
                });
            }

            return result;
        };

        utils.register(Datepicker);

        return Datepicker;
    }
);
