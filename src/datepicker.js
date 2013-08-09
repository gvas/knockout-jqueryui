/*global $, ko, bindingFactory*/
(function () {
    'use strict';

    var postInit;

    postInit = function (element, valueAccessor) {
        /// <summary>Sets up the 'value' option.</summary>
        /// <param name='element' type='DOMNode'></param>
        /// <param name='valueAccessor' type='Function'></param>

        var options, value, subscription, origOnSelect;

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
    };

    bindingFactory.create({
        name: 'datepicker',
        options: ['altField', 'altFormat', 'appendText', 'autoSize', 'buttonImage',
            'buttonImageOnly', 'buttonText', 'calculateWeek', 'changeMonth', 'changeYear',
            'closeText', 'constrainInput', 'currentText', 'dateFormat', 'dayNames',
            'dayNamesMin', 'dayNamesShort', 'defaultDate', 'duration', 'firstDay',
            'gotoCurrent', 'hideIfNoPrevNext', 'isRTL', 'maxDate', 'minDate',
            'monthNames', 'monthNamesShort', 'navigationAsDateFormat', 'nextText',
            'numberOfMonths', 'prevText', 'selectOtherMonths', 'shortYearCutoff',
            'showAnim', 'showButtonPanel', 'showCurrentAtPos', 'showMonthAfterYear',
            'showOn', 'showOptions', 'showOtherMonths', 'showWeek', 'stepMonths',
            'weekHeader', 'yearRange', 'yearSuffix', 'beforeShow', 'beforeShowDay',
            'onChangeMonthYear', 'onClose', 'onSelect'],
        events: [],
        postInit: postInit
    });
}());