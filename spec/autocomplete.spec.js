/*global ko, $, jasmine, describe, it, beforeEach, afterEach, spyOn, expect*/
/*jslint maxlen:256*/
(function () {
    'use strict';

    describe('The autocomplete binding', function () {
        afterEach(function () {
            delete ko.bindingHandlers.test;
        });

        it('should handle each option of the widget', function () {
            var $element, vm;

            $element = $('<div data-bind="autocomplete: { appendTo: appendTo, autoFocus: autoFocus, '
                + 'delay: delay, disabled: disabled, minLength: minLength, '
                + 'position: position, source: source }"></div>').appendTo('body');
            vm = {
                appendTo: 'body',
                autoFocus: true,
                delay: 400,
                disabled: true,
                minLength: 2,
                position: { my: 'right top', at: 'right bottom', collision: 'none' },
                source: ['1', '2']
            };

            ko.applyBindings(vm);

            ko.utils.arrayForEach(['appendTo', 'autoFocus', 'delay', 'disabled', 'minLength',
                'position', 'source'], function (optionName) {
                    expect($element.autocomplete('option', optionName)).toEqual(vm[optionName]);
            });

            ko.removeNode($element[0]);
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