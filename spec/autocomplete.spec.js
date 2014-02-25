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

            ko.applyBindings(vm, $element[0]);

            expect(vm.createEventHandler).toHaveBeenCalled();

            ko.removeNode($element[0]);
        });

        it('should write the element to the widget observable', function () {
            var $element, vm, disabled;

            $element = $('<div data-bind="autocomplete: { widget: widget, disabled: true }"></div>').appendTo('body');
            vm = { widget: ko.observable() };
            ko.applyBindings(vm, $element[0]);

            expect(vm.widget()).toBeDefined();

            disabled = vm.widget().autocomplete('option', 'disabled');

            expect(disabled).toBe(true);

            ko.removeNode($element[0]);
        });

        it('should fill in the selectedItem when that bindings is specified', function() {
            var $element, vm, keyboardEvent;

            $element = $('<input data-bind="autocomplete: { source: PossibleColors, selectedValue: SelectedColor }"></div>')
                .appendTo('body');

            vm = {
                PossibleColors: [
                    'red',
                    'green',
                    'blue'
                ],
                SelectedColor: ko.observable('red')
            };
            ko.applyBindings(vm, $element[0]);

            //autocomplete not used yet, expect the original value from viewModel
            expect(vm.SelectedColor()).toBe('red');

            //now 'use' the autocomplete
            $element.autocomplete('search', 'gree'); //start a search that will get us the result we want

            keyboardEvent = $.Event("keydown");
            keyboardEvent.keyCode = $.ui.keyCode.DOWN;

            $element.trigger(keyboardEvent); //simulate the user selecting it

            expect(vm.SelectedColor()).toBe('red'); //should STILL be red, we only focused it and didn't select, yet.

            keyboardEvent.keyCode = $.ui.keyCode.ENTER;
            $element.trigger(keyboardEvent); //confirm selection with enter key

            expect(vm.SelectedColor()).toBe('green'); //now expect new value;

            ko.removeNode($element[0]);
        });
    });
}());