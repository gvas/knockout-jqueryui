/*global ko, $, jasmine, describe, it, beforeEach, afterEach, spyOn, expect*/
/*jslint maxlen:256*/
(function () {
    'use strict';

    describe('The accordion binding', function () {
        afterEach(function () {
            delete ko.bindingHandlers.test;
        });

        it('should handle each option of the widget', function () {
            var $element, vm;

            $element = $('<div data-bind="accordion: { active: active, animate: animate, '
                + 'collapsible: collapsible, disabled: disabled, event: event, '
                + 'header: header, heightStyle: heightStyle, icons: icons }"></div>')
                .appendTo('body');
            vm = {
                active: false,
                animate: 1,
                collapsible: true,
                disabled: true,
                event: 'mouseover',
                header: 'h3',
                heightStyle: 'content',
                icons: { header: 'ui-icon-plus', activeHeader: 'ui-icon-minus', headerSelected: 'ui-icon-minus' }
            };

            ko.applyBindings(vm);

            ko.utils.arrayForEach(['active', 'animate', 'collapsible', 'disabled',
                'event', 'header', 'heightStyle', 'icons'],
                function (optionName) {
                    expect($element.accordion('option', optionName)).toEqual(vm[optionName]);
                });

            ko.removeNode($element[0]);
        });

        it('should handle each event of the widget', function () {
            var $element, vm;

            $element = $('<div data-bind="accordion: { create: createEventHandler }"></div>').appendTo('body');
            vm = { createEventHandler: jasmine.createSpy() };

            ko.applyBindings(vm);

            expect(vm.createEventHandler).toHaveBeenCalled();

            ko.removeNode($element[0]);
        });
    });
} ());