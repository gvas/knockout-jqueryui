/*global ko, $, jasmine, describe, it, beforeEach, afterEach, spyOn, expect*/
/*jslint maxlen:256*/
(function () {
    'use strict';

    describe('The spinner binding', function () {
        afterEach(function () {
            delete ko.bindingHandlers.test;
        });

        it('should handle each option of the widget', function () {
            var $element, vm;

            $element = $('<div data-bind="spinner: { culture: culture, disabled: disabled, '
                + 'icons: icons, incremental: incremental, max: max, min: min, '
                + 'numberFormat: numberFormat, page: page, step: step }"></div>')
                .appendTo('body');
            vm = {
                culture: 'fr',
                disabled: true,
                event: 'mouseover',
                icons: { down: 'custom-down-icon', up: 'custom-up-icon' },
                incremental: false,
                max: 50,
                min: 10,
                numberFormat: 'n',
                page: 5,
                step: 2
            };

            ko.applyBindings(vm);

            ko.utils.arrayForEach(['culture', 'disabled', 'icons', 'incremental', 'max',
                'min', 'numberFormat', 'page', 'step'],
                function (optionName) {
                    expect($element.spinner('option', optionName)).toEqual(vm[optionName]);
                });

            ko.removeNode($element[0]);
        });

        it('should handle each event of the widget', function () {
            var $element, vm;

            $element = $('<div data-bind="spinner: { create: createEventHandler }"></div>').appendTo('body');
            vm = { createEventHandler: jasmine.createSpy() };

            ko.applyBindings(vm);

            expect(vm.createEventHandler).toHaveBeenCalled();

            ko.removeNode($element[0]);
        });
    });
} ());