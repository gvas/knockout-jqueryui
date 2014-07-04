/*global $, ko, exports*/
(function () {

    'use strict';

    var Datepicker = function () {
        /// <summary>Constructor.</summary>

        exports.BindingHandler.call(this, 'datepicker');

        this.options = ['altField', 'altFormat', 'appendText', 'autoSize', 'buttonImage',
            'buttonImageOnly', 'buttonText', 'calculateWeek', 'changeMonth', 'changeYear',
            'closeText', 'constrainInput', 'currentText', 'dateFormat', 'dayNames',
            'dayNamesMin', 'dayNamesShort', 'defaultDate', 'duration', 'firstDay',
            'gotoCurrent', 'hideIfNoPrevNext', 'isRTL', 'maxDate', 'minDate',
            'monthNames', 'monthNamesShort', 'navigationAsDateFormat', 'nextText',
            'numberOfMonths', 'prevText', 'selectOtherMonths', 'shortYearCutoff',
            'showAnim', 'showButtonPanel', 'showCurrentAtPos', 'showMonthAfterYear',
            'showOn', 'showOptions', 'showOtherMonths', 'showWeek', 'stepMonths',
            'weekHeader', 'yearRange', 'yearSuffix', 'beforeShow', 'beforeShowDay',
            'onChangeMonthYear', 'onClose', 'onSelect'];
    };

    Datepicker.prototype = exports.utils.createObject(exports.BindingHandler.prototype);
    Datepicker.prototype.constructor = Datepicker;

    Datepicker.prototype.init = function (element, valueAccessor) {
        /// <summary>Keeps the value binding property in sync with the widget's state.
        /// </summary>
        /// <param name='element' type='DOMNode'></param>
        /// <param name='valueAccessor' type='Function'></param>
        /// <returns type='Object'></returns>

        var options, value, subscription, origOnSelect;

        exports.BindingHandler.prototype.init.apply(this, arguments);

        options = valueAccessor();
        value = ko.utils.unwrapObservable(options.value);

        if (value) {
            $(element).datepicker('setDate', value);
        }

        if (ko.isObservable(options.value)) {
            subscription = options.value.subscribe(function (newValue) {
                $(element).datepicker('setDate', newValue);
            });

            ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
                subscription.dispose();
            });
        }

        if (ko.isWriteableObservable(options.value)) {
            origOnSelect = $(element).datepicker('option', 'onSelect');
            $(element).datepicker('option', 'onSelect', function (selectedText) {
                var format, date;

                format = $(element).datepicker('option', 'dateFormat');
                date = $.datepicker.parseDate(format, selectedText);
                options.value(date);

                if (typeof origOnSelect === 'function') {
                    origOnSelect.apply(this, Array.prototype.slice.call(arguments));
                }
            });
        }

        // the inner elements have already been taken care of
        return { controlsDescendantBindings: true };
    };

    exports.Datepicker = Datepicker;

    exports.bindingHandlerRegistry.register(new Datepicker());
}());