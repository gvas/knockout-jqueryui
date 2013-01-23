/*global ko, $, jasmine, describe, it, beforeEach, afterEach, spyOn, expect*/
/*jslint maxlen:256*/
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

            ko.applyBindings(vm);

            expect(vm.createEventHandler).toHaveBeenCalled();

            ko.removeNode($element[0]);
        });
    });
}());