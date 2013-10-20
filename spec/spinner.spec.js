/*jslint maxlen:256, browser:true*/
/*global ko, $, jasmine, describe, it, beforeEach, afterEach, spyOn, expect, runs, waitsFor, getMajorMinorVersion, testWidgetOptions*/
(function () {
    'use strict';

    if (getMajorMinorVersion($.ui.version) === '1.8') {
        // spinner was introduced in 1.9
        return;
    }

    describe('The spinner binding', function () {
        it('should handle each option of the widget', function () {
            testWidgetOptions('spinner', {
                culture: [null, 'fr'],
                disabled: [false, true],
                icons: [{ down: 'ui-icon-triangle-1-s', up: 'ui-icon-triangle-1-n' }, { down: 'custom-down-icon', up: 'custom-up-icon'}],
                incremental: [true, false],
                max: [null, 50],
                min: [null, 10],
                numberFormat: [null, 'n'],
                page: [10, 5],
                step: [1, 2]
            });
        });

        it('should handle each event of the widget', function () {
            var $element, vm;

            $element = $('<div data-bind="spinner: { create: createEventHandler }"></div>').appendTo('body');
            vm = { createEventHandler: jasmine.createSpy() };

            ko.applyBindings(vm, $element[0]);

            expect(vm.createEventHandler).toHaveBeenCalled();

            ko.removeNode($element[0]);
        });

        it('should write the widget\'s value to the viewmodel\'s bound property when it changes.', function () {
            var $element, flag = false, vm;

            $element = $('<input data-bind="spinner: { value: value }" />').appendTo('body');

            vm = { value: ko.observable(1) };
            ko.applyBindings(vm, $element[0]);

            expect(vm.value.peek()).toEqual(1);
            $element.spinner('value', 55);
            expect(vm.value.peek()).toEqual(55);
            $element.spinner('stepUp');
            expect(vm.value.peek()).toEqual(56);

            // This spec tests that the view model's bound property is only updated when
            // the spinner's input is blurred.
            // The spinner widget ensures that the focus is set to the input when the up-
            // or down button is clicked, but IE raises the focus/blur events
            // asynchronously, so we also have to test it asynchronously.
            runs(function () {
                $element.spinner('widget').find('.ui-spinner-up')
                    .mousedown()
                    .mouseup();
                setTimeout(function () {
                    expect($element.spinner('value')).toEqual(57);
                    expect(vm.value.peek()).toEqual(56); // Focus is still on the input, so the spinner hasn't fired spinchange yet.
                    $element.blur();
                    setTimeout(function () { flag = true; }, 150); // open the latch
                }, 150);
            });

            waitsFor(function () {
                return flag;
            }, 'latch wasn\'t opened', 1000);

            runs(function () {
                expect(vm.value.peek()).toEqual(57); // *Now* the observable should be mutated.

                ko.removeNode($element[0]);
            });
        });

        it('should write the widget\'s value immediately to the viewmodel\'s bound property when it changes if "valueUpdate" binding is also used on the input.', function () {
            var $element, vm;

            $element = $('<input data-bind="valueUpdate: \'afterkeydown\', spinner: { value: value }" />').appendTo('body');

            vm = { value: ko.observable(100) };
            ko.applyBindings(vm, $element[0]);
            $element.spinner('widget').find('.ui-spinner-up')
                .mousedown()
                .mouseup();
            expect(vm.value.peek()).toEqual(101);

            ko.removeNode($element[0]);
        });

        it('should write the element to the widget observable', function () {
            var $element, vm, disabled;

            $element = $('<div data-bind="spinner: { widget: widget, disabled: true }"></div>').appendTo('body');
            vm = { widget: ko.observable() };
            ko.applyBindings(vm, $element[0]);

            expect(vm.widget()).toBeDefined();

            disabled = vm.widget().spinner('option', 'disabled');

            expect(disabled).toBe(true);

            ko.removeNode($element[0]);
        });
    });
}());