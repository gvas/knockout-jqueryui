/*global ko, $, jasmine, describe, it, beforeEach, afterEach, spyOn, expect*/
/*jslint maxlen:256*/
(function () {
    'use strict';

    describe('The datepicker binding', function () {
        afterEach(function () {
            delete ko.bindingHandlers.test;
        });

        it('should handle each option of the widget', function () {
            var $element, vm;

            $element = $('<input data-bind="datepicker: { altField: altField, altFormat: altFormat, '
                + 'appendText: appendText, autoSize: autoSize, buttonImage: buttonImage,'
                + 'buttonImageOnly: buttonImageOnly, buttonText: buttonText, calculateWeek: calculateWeek, '
                + 'changeMonth: changeMonth, changeYear: changeYear, closeText: closeText, '
                + 'constrainInput: constrainInput, currentText: currentText, dateFormat: dateFormat, '
                + 'dayNames: dayNames, dayNamesMin: dayNamesMin, dayNamesShort: dayNamesShort, '
                + 'defaultDate: defaultDate, duration: duration, firstDay: firstDay, '
                + 'gotoCurrent: gotoCurrent, hideIfNoPrevNext: hideIfNoPrevNext, isRTL: isRTL, '
                + 'maxDate: maxDate, minDate: minDate, monthNames: monthNames, monthNamesShort: monthNamesShort, '
                + 'navigationAsDateFormat: navigationAsDateFormat, nextText: nextText, '
                + 'numberOfMonths: numberOfMonths, prevText: prevText, selectOtherMonths: selectOtherMonths, '
                + 'shortYearCutoff: shortYearCutoff, showAnim: showAnim, showButtonPanel: showButtonPanel, '
                + 'showCurrentAtPos: showCurrentAtPos, showMonthAfterYear: showMonthAfterYear, '
                + 'showOn: showOn, showOptions: showOptions, showOtherMonths: showOtherMonths, '
                + 'showWeek: showWeek, stepMonths: stepMonths, weekHeader: weekHeader, '
                + 'yearRange: yearRange, yearSuffix: yearSuffix, beforeShow: beforeShow, '
                + 'beforeShowDay: beforeShowDay, onChangeMonthYear: onChangeMonthYear, '
                + 'onClose: onClose, onSelect: onSelect }" />').appendTo('body');
            vm = {
                altField: '',
                altFormat: 'yy-mm-dd',
                appendText: '(yy-mm-dd)',
                autoSize: true,
                beforeShow: function () { return {}; },
                beforeShowDay: function () { return [true, '']; },
                buttonImage: '/images/datepicker.gif',
                buttonImageOnly: true,
                buttonText: 'Choose',
                calculateWeek: $.datepicker.iso8601Week,
                changeMonth: true,
                changeYear: true,
                closeText: 'Close',
                constrainInput: false,
                currentText: 'Now',
                dateFormat: 'yy-mm-dd',
                dayNames: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
                dayNamesMin: ['a', 'b', 'c', 'd', 'e', 'f', 'g'],
                dayNamesShort: ['a', 'b', 'c', 'd', 'e', 'f', 'g'],
                defaultDate: 2,
                duration: 'slow',
                firstDay: 1,
                gotoCurrent: true,
                hideIfNoPrevNext: true,
                isRTL: true,
                maxDate: 2,
                minDate: 2,
                monthNames: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l'],
                monthNamesShort: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l'],
                navigationAsDateFormat: true,
                nextText: 'Later',
                numberOfMonths: 2,
                onChangeMonthYear: function () { },
                onClose: function () { },
                onSelect: function () { },
                prevText: 'Earlier',
                selectOtherMonths: true,
                shortYearCutoff: '+1',
                showAnim: 'fadeIn',
                showButtonPanel: true,
                showCurrentAtPos: 1,
                showMonthAfterYear: true,
                showOn: 'both',
                showOptions: { direction: 'up' },
                showOtherMonths: true,
                showWeek: true,
                stepMonths: 2,
                weekHeader: 'W',
                yearRange: '2002:2012',
                yearSuffix: 'CE',
                beforeShow: function () { },
                beforeShowDay: function () { },
                onChangeMonthYear: function () { },
                onClose: function () { },
                onSelect: function () { }
            };

            ko.applyBindings(vm);

            ko.utils.arrayForEach(['altField', 'altFormat', 'appendText', 'autoSize', 'buttonImage',
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
                function (optionName) {
                    expect($element.datepicker('option', optionName)).toEqual(vm[optionName]);
                });

            ko.removeNode($element[0]);
        });
    });
} ());