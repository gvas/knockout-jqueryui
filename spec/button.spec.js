/*global ko, $, jasmine, describe, it, beforeEach, afterEach, spyOn, expect*/
/*jslint maxlen:256*/
(function () {
    'use strict';

    describe('The button binding', function () {
        afterEach(function () {
            delete ko.bindingHandlers.test;
        });

        it('should handle each option of the widget', function () {
            var $element, vm;

            $element = $('<div data-bind="button: { disabled: disabled, icons: icons, label: label, text: text }"></div>').appendTo('body');
            vm = {
                disabled: true,
                icons: { primary: 'ui-icon-plus', secondary: null },
                label: 'Test',
                text: false
            };

            ko.applyBindings(vm);

            ko.utils.arrayForEach(['disabled', 'icons', 'label', 'text'], function (optionName) {
                expect($element.button('option', optionName)).toEqual(vm[optionName]);
            });

            ko.removeNode($element[0]);
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