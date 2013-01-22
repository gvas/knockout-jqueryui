/*global ko, $, jasmine, describe, it, beforeEach, afterEach, spyOn, expect*/
/*jslint maxlen:256*/
(function () {
    'use strict';

    describe('The progressbar binding', function () {
        afterEach(function () {
            delete ko.bindingHandlers.test;
        });

        it('should handle each option of the widget', function () {
            var $element, vm;

            $element = $('<div data-bind="progressbar: { disabled: disabled, '
                + 'max: max, value: value }"></div>')
                .appendTo('body');
            vm = {
                disabled: true,
                max: 50,
                value: 10
            };

            ko.applyBindings(vm);

            ko.utils.arrayForEach(['disabled', 'max', 'value'],
                function (optionName) {
                    expect($element.progressbar('option', optionName)).toEqual(vm[optionName]);
                });

            ko.removeNode($element[0]);
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
} ());