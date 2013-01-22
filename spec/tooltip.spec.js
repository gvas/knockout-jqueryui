/*global ko, $, jasmine, describe, it, beforeEach, afterEach, spyOn, expect*/
/*jslint maxlen:256*/
(function () {
    'use strict';

    describe('The tooltip binding', function () {
        afterEach(function () {
            delete ko.bindingHandlers.test;
        });

        it('should handle each option of the widget', function () {
            var $element, vm;

            $element = $('<div data-bind="tooltip: { content: content, disabled: disabled, '
                + 'hide: hide, items: items, position: position, show: show, '
                + 'tooltipClass: tooltipClass, track: track }"></div>')
                .appendTo('body');
            vm = {
                content: 'asdf',
                disabled: true,
                hide: false,
                items: 'img[alt]',
                position: { my: 'left+15 center', at: 'right center', collision: 'flipfit flip' },
                show: false,
                tooltipClass: 'custom-tooltip-styling',
                track: true
            };

            ko.applyBindings(vm);

            ko.utils.arrayForEach(['content', 'disabled', 'hide', 'items', 'position', 'show',
                'tooltipClass', 'track'],
                function (optionName) {
                    expect($element.tooltip('option', optionName)).toEqual(vm[optionName]);
                });

            ko.removeNode($element[0]);
        });

        it('should handle each event of the widget', function () {
            var $element, vm;

            $element = $('<div data-bind="tooltip: { create: createEventHandler }"></div>').appendTo('body');
            vm = { createEventHandler: jasmine.createSpy() };

            ko.applyBindings(vm);

            expect(vm.createEventHandler).toHaveBeenCalled();

            ko.removeNode($element[0]);
        });
    });
} ());