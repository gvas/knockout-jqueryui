/*jslint maxlen:256*/
/*global ko, $, jasmine, describe, it, beforeEach, afterEach, spyOn, expect, getMajorMinorVersion, testWidgetOptions*/
(function () {
    'use strict';

    describe('The progressbar binding', function () {
        it('should handle each option of the widget', function () {

            var optionsToTest = {
                disabled: [false, true],
                value: [0, 10]
            };

            /*jslint white:true*/
            switch (getMajorMinorVersion($.ui.version)) {
                case '1.8':
                    break;
                default:
                    $.extend(optionsToTest, {
                        max: [0, 50]
                    });
                    break;
            }
            /*jslint white:false*/

            testWidgetOptions('progressbar', optionsToTest);
        });

        it('should handle each event of the widget', function () {
            var $element, vm;

            $element = $('<div data-bind="progressbar: { create: createEventHandler }"></div>').prependTo('body');
            vm = { createEventHandler: jasmine.createSpy() };

            ko.applyBindings(vm, $element[0]);

            expect(vm.createEventHandler).toHaveBeenCalled();

            ko.removeNode($element[0]);
        });

        it('should write the element to the widget observable', function () {
            var $element, vm, disabled;

            $element = $('<div data-bind="progressbar: { widget: widget, disabled: true }"></div>').prependTo('body');
            vm = { widget: ko.observable() };
            ko.applyBindings(vm, $element[0]);

            expect(vm.widget()).toBeDefined();

            disabled = vm.widget().progressbar('option', 'disabled');

            expect(disabled).toBe(true);

            ko.removeNode($element[0]);
        });
    });
}());
