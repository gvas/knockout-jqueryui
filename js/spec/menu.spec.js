/*jslint maxlen:256*/
/*global ko, $, jasmine, describe, it, beforeEach, afterEach, spyOn, expect, testWidgetOptions*/
(function () {
    'use strict';

    describe('The menu binding', function () {
        it('should handle each option of the widget', function () {

            var optionsToTest = {
                disabled: [false, true],
                icons: [{ submenu: 'ui-icon-carat-1-e' }, { submenu: 'ui-icon-circle-triangle-e'}],
                menus: ['ul', 'div'],
                position: [{ my: 'left top', at: 'right top' }, { my: 'left top', at: 'right-5 top+5'}],
                role: ['menu', null]
            };

            /*jslint white:true*/
            switch (getMajorMinorVersion($.ui.version)) {
                case '1.8':
                case '1.9':
                case '1.10':
                    break;
                default:
                    $.extend(optionsToTest, {
                        items: ['> *', '> li']
                    });
                    break;
            }
            /*jslint white:false*/

            testWidgetOptions('menu', optionsToTest);
        });

        it('should handle each event of the widget', function () {
            var $element, vm;

            $element = $('<div data-bind="menu: { create: createEventHandler }"></div>').prependTo('body');
            vm = { createEventHandler: jasmine.createSpy() };

            ko.applyBindings(vm, $element[0]);

            expect(vm.createEventHandler).toHaveBeenCalled();

            ko.removeNode($element[0]);
        });

        it('should write the element to the widget observable', function () {
            var $element, vm, disabled;

            $element = $('<div data-bind="menu: { widget: widget, disabled: true }"></div>').prependTo('body');
            vm = { widget: ko.observable() };
            ko.applyBindings(vm, $element[0]);

            expect(vm.widget()).toBeDefined();

            disabled = vm.widget().menu('option', 'disabled');

            expect(disabled).toBe(true);

            ko.removeNode($element[0]);
        });
    });
}());
