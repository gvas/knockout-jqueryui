/*jslint maxlen:256*/
/*global ko, $, jasmine, describe, it, beforeEach, afterEach, spyOn, expect, testWidgetOptions*/
(function () {
    'use strict';

    describe('The datepicker binding', function () {
        it('should handle each option of the widget', function () {
            testWidgetOptions('datepicker', {
                altField: ['', 'div'],
                altFormat: ['', 'yy-mm-dd'],
                appendText: ['', '(yy-mm-dd)'],
                autoSize: [false, true],
                buttonImage: ['', '/images/datepicker.gif'],
                buttonImageOnly: [false, true],
                buttonText: ['...', 'Choose'],
                calculateWeek: [$.datepicker.iso8601Week, function () { return 1; } ],
                changeMonth: [false, true],
                changeYear: [false, true],
                closeText: ['Done', 'Close'],
                constrainInput: [true, false],
                currentText: ['Today', 'Now'],
                dateFormat: ['mm/dd/yy', 'yy-mm-dd'],
                dayNames: [['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], ['A', 'B', 'C', 'D', 'E', 'F', 'G']],
                dayNamesMin: [['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'], ['a', 'b', 'c', 'd', 'e', 'f', 'g']],
                dayNamesShort: [['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], ['a', 'b', 'c', 'd', 'e', 'f', 'g']],
                defaultDate: [null, 2],
                duration: ['normal', 'slow'],
                firstDay: [0, 1],
                gotoCurrent: [false, true],
                hideIfNoPrevNext: [false, true],
                isRTL: [false, true],
                maxDate: [null, 2],
                minDate: [null, 2],
                monthNames: [['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'], ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l']],
                monthNamesShort: [['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'], ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l']],
                navigationAsDateFormat: [false, true],
                nextText: ['Next', 'Later'],
                numberOfMonths: [1, 2],
                prevText: ['Prev', 'Earlier'],
                selectOtherMonths: [false, true],
                shortYearCutoff: ['+10', '+1'],
                showAnim: ['show', 'fadeIn'],
                showButtonPanel: [false, true],
                showCurrentAtPos: [0, 1],
                showMonthAfterYear: [false, true],
                showOn: ['focus', 'both'],
                showOptions: [{}, { direction: 'up'}],
                showOtherMonths: [false, true],
                showWeek: [false, true],
                stepMonths: [1, 2],
                weekHeader: ['Wk', 'W'],
                yearRange: ['c-10:c+10', '2002:2012'],
                yearSuffix: ['', 'CE'],
                beforeShow: [null, function () { } ],
                beforeShowDay: [null, function () { return [true, '']; } ],
                onChangeMonthYear: [null, function () { } ],
                onClose: [null, function () { } ],
                onSelect: [null, function () { } ]
            });
        });

        it('should write the element to the widget observable', function () {
            var $element, vm, autoSize;

            $element = $('<div data-bind="datepicker: { widget: widget, autoSize: true }"></div>').prependTo('body');
            vm = { widget: ko.observable() };
            ko.applyBindings(vm, $element[0]);

            expect(vm.widget()).toBeDefined();

            autoSize = vm.widget().datepicker('option', 'autoSize');

            expect(autoSize).toBe(true);

            ko.removeNode($element[0]);
        });

        it('should write the widget\'s value to the \'value\' observable when it changes.', function () {
            var $element, vm, now;

            $element = $('<div data-bind="datepicker: { value: value }"></div>').prependTo('body');
            vm = { value: ko.observable() };
            ko.applyBindings(vm, $element[0]);

            expect(vm.value.peek()).not.toBeDefined();
            // The datepicker's setDate() method wouldn't work as expected, because it doesn't
            // triggers the onSelected callback. Let's simulate a user click instead.
            $('.ui-datepicker-today').click();
            now = new Date();
            now.setHours(0, 0, 0, 0);
            expect(vm.value.peek()).toEqual(now);

            ko.removeNode($element[0]);
        });

        it('should write the \'value\' observable to the widget\'s value when it changes.', function () {
            var $element, vm, date;

            $element = $('<div data-bind="datepicker: { value: value }"></div>').prependTo('body');
            vm = {
                value: ko.observable()
            };
            ko.applyBindings(vm, $element[0]);

            vm.value(new Date(2000, 1, 1));
            date = $element.datepicker('getDate');
            expect(date).toEqual(new Date(2000, 1, 1));

            ko.removeNode($element[0]);
        });
    });
}());