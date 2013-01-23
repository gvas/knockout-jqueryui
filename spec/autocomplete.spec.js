/*global ko, $, jasmine, describe, it, beforeEach, afterEach, spyOn, expect*/
/*jslint maxlen:256*/
(function () {
    'use strict';

    describe('The autocomplete binding', function () {
        it('should handle each option of the widget', function () {
            testWidgetOptions('autocomplete', {
                appendTo: ['body', ':parent'],
                autoFocus: [false, true],
                delay: [300, 400],
                disabled: [false, true],
                minLength: [1, 2],
                position: [{ my: 'left top', at: 'left bottom', collision: 'none' }, { my: 'right top', at: 'right bottom', collision: 'none'}],
                source: [['a', 'b'], ['1', '2']]
            });
        });

        it('should handle each event of the widget', function () {
            var $element, vm;

            $element = $('<div data-bind="autocomplete: { create: createEventHandler }"></div>').appendTo('body');
            vm = { createEventHandler: jasmine.createSpy() }

            ko.applyBindings(vm);

            expect(vm.createEventHandler).toHaveBeenCalled();

            ko.removeNode($element[0]);
        });
    });
}());