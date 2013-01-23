/*global ko, $, jasmine, describe, it, beforeEach, afterEach, spyOn, expect*/
/*jslint maxlen:256*/
(function () {
    'use strict';

    describe('The button binding', function () {
        it('should handle each option of the widget', function () {
            testWidgetOptions('button', {
                disabled: [false, true],
                icons: [{ primary: null, secondary: null }, { primary: 'ui-icon-plus', secondary: null }],
                label: [null, 'Test'],
                text: [true, false]
            });
        });

        it('should handle each event of the widget', function () {
            var $element, vm;

            $element = $('<div data-bind="button: { create: createEventHandler }"></div>').appendTo('body');
            vm = { createEventHandler: jasmine.createSpy() }

            ko.applyBindings(vm);

            expect(vm.createEventHandler).toHaveBeenCalled();

            ko.removeNode($element[0]);
        });
    });
} ());