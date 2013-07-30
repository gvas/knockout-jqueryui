/*jslint maxlen:256*/
/*global ko, $, jasmine, describe, it, beforeEach, afterEach, spyOn, expect, testWidgetOptions*/
(function () {
    'use strict';

    describe('The slider binding', function () {
        it('should handle each option of the widget', function () {
            testWidgetOptions('slider', {
                animate: [false, 'fast'],
                disabled: [false, true],
                max: [100, 50],
                min: [0, 20],
                orientation: ['horizontal', 'vertical'],
                range: [false, true],
                step: [1, 2],
                value: [0, 10],
                values: [null, [10, 20]]
            });
        });

        it('should handle each event of the widget', function () {
            var $element, vm;

            $element = $('<div data-bind="slider: { create: createEventHandler }"></div>').appendTo('body');
            vm = { createEventHandler: jasmine.createSpy() };

            ko.applyBindings(vm, $element[0]);

            expect(vm.createEventHandler).toHaveBeenCalled();

            ko.removeNode($element[0]);
        });

        it('should write the widget\'s value to the viewmodel\'s bound property when it changes.', function () {
            var $element, vm;

            $element = $('<div data-bind="slider: { value: value }"></div>').appendTo('body');
            vm = { value: ko.observable(1) };
            ko.applyBindings(vm, $element[0]);

            expect(vm.value.peek()).toEqual(1);
            $element.slider('value', 55);
            expect(vm.value.peek()).toEqual(55);

            ko.removeNode($element[0]);
        });

        it('should write the widget\'s value to the viewmodel\'s bound property when the values option changes.', function () {
            var $element, vm;

            $element = $('<div data-bind="slider: { value: value, values: values }"></div>').appendTo('body');
            vm = {
                value: ko.observable(30),
                values: ko.observableArray([30, 60])
            };
            ko.applyBindings(vm, $element[0]);

            expect(vm.value.peek()).toEqual(30);
            $element.slider('values', [40, 60]);
            expect(vm.value.peek()).toEqual(40);

            ko.removeNode($element[0]);
        });

        it('should write the element to the widget observable', function () {
            var $element, vm, disabled;

            $element = $('<div data-bind="slider: { widget: widget, disabled: true }"></div>').appendTo('body');
            vm = { widget: ko.observable() };
            ko.applyBindings(vm, $element[0]);

            expect(vm.widget()).toBeDefined();

            disabled = vm.widget().slider('option', 'disabled');

            expect(disabled).toBe(true);

            ko.removeNode($element[0]);
        });
    });
}());