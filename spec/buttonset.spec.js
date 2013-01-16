/*global ko, $, jasmine, describe, it, beforeEach, afterEach, spyOn, expect*/
/*jslint maxlen:256*/
(function () {
    'use strict';

    describe('The buttonset binding', function () {
        afterEach(function () {
            delete ko.bindingHandlers.test;
        });

        it('should handle each option of the widget', function () {
            var $element, vm;

            $element = $('<div data-bind="buttonset: { items: items, disabled: disabled }"></div>').appendTo('body');
            vm = {
                items: '#buttonset',
                disabled: true
            };

            ko.applyBindings(vm);

            ko.utils.arrayForEach(['items', 'disabled'], function (optionName) {
                expect($element.buttonset('option', optionName)).toEqual(vm[optionName]);
            });

            ko.removeNode($element[0]);
        });

        it('should handle each event of the widget', function () {
            var $element, vm;

            $element = $('<div data-bind="buttonset: { create: createEventHandler }"></div>').appendTo('body');
            vm = { createEventHandler: jasmine.createSpy() }

            ko.applyBindings(vm);

            expect(vm.createEventHandler).toHaveBeenCalled();

            ko.removeNode($element[0]);
        });
    });
} ());