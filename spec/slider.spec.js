/*global ko, $, jasmine, describe, it, beforeEach, afterEach, spyOn, expect*/
/*jslint maxlen:256*/
(function () {
    'use strict';

    describe('The slider binding', function () {
        afterEach(function () {
            delete ko.bindingHandlers.test;
        });

        it('should handle each option of the widget', function () {
            var $element, vm;

            $element = $('<div data-bind="slider: { animate: animate, disabled: disabled, '
                + 'max: max, min: min, orientation: orientation, range: range, step: step, '
                + 'value: value, values: values }"></div>')
                .appendTo('body');
            vm = {
                animate: 'fast',
                disabled: true,
                max: 50,
                min: 20,
                orientation: 'vertical',
                range: true,
                step: 2,
                value: 10,
                values: [10, 20]
            };

            ko.applyBindings(vm);

            ko.utils.arrayForEach(['animate', 'disabled', 'max', 'min', 'orientation',
                'range', 'step', 'value', 'values'],
                function (optionName) {
                    expect($element.slider('option', optionName)).toEqual(vm[optionName]);
                });

            ko.removeNode($element[0]);
        });

        it('should handle each event of the widget', function () {
            var $element, vm;

            $element = $('<div data-bind="slider: { create: createEventHandler }"></div>').appendTo('body');
            vm = { createEventHandler: jasmine.createSpy() };

            ko.applyBindings(vm);

            expect(vm.createEventHandler).toHaveBeenCalled();

            ko.removeNode($element[0]);
        });
    });
}());