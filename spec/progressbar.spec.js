/*global ko, $, jasmine, describe, it, beforeEach, afterEach, spyOn, expect*/
/*jslint maxlen:256*/
(function () {
    'use strict';

    describe('The progressbar binding', function () {
        it('should handle each option of the widget', function () {

            var optionsToTest = {
                disabled: [false, true],
                value: [0, 10]
            };

            switch (getMajorMinorVersion($.ui.version)) {
                case '1.9':
                case '1.10':
                    $.extend(optionsToTest, {
                        max: [0, 50]
                    });
                    break;
            }

            testWidgetOptions('progressbar', optionsToTest);
        });

        it('should handle each event of the widget', function () {
            var $element, vm;

            $element = $('<div data-bind="progressbar: { create: createEventHandler }"></div>').appendTo('body');
            vm = { createEventHandler: jasmine.createSpy() };

            ko.applyBindings(vm);

            expect(vm.createEventHandler).toHaveBeenCalled();

            ko.removeNode($element[0]);
        });
    });
}());