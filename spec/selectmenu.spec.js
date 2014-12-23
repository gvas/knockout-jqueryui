/*jslint maxlen:256*/
/*global ko, $, jasmine, describe, it, spyOn, expect, getMajorMinorVersion, testWidgetOptions*/
(function () {
    'use strict';

    if (/^1\.(?:8|9|10)$/.test(getMajorMinorVersion($.ui.version))) {
        // selectmenu was introduced in 1.11
        return;
    }

    describe('The selectmenu binding', function () {
        it('should handle each option of the widget', function () {

            var optionsToTest = {
                appendTo: [null, 'body'],
                disabled: [false, true],
                icons: [{ button: "ui-icon-triangle-1-s" }, { button: "ui-icon-circle-triangle-s"}],
                position: [{ my: "left top", at: "left bottom", collision: "none" }, { my: "left+10 center", at: "right center"}],
                width: [null, 200]
            };

            testWidgetOptions('selectmenu', optionsToTest);
        });

        it('should handle each event of the widget', function () {
            var $element, vm;

            $element = $('<div data-bind="selectmenu: { create: createEventHandler }"></div>').prependTo('body');
            vm = { createEventHandler: jasmine.createSpy() };

            ko.applyBindings(vm, $element[0]);

            expect(vm.createEventHandler).toHaveBeenCalled();

            ko.removeNode($element[0]);
        });

        it('should write the widget\'s state back to the viewmodel when opened/closed.', function () {
            var $element, vm;

            $element = $('<div data-bind="selectmenu: { isOpen: isOpen }"></div>').prependTo('body');
            vm = { isOpen: ko.observable(false) };
            ko.applyBindings(vm, $element[0]);

            expect(vm.isOpen.peek()).toEqual(false);
            $element.selectmenu('open');
            expect(vm.isOpen.peek()).toEqual(true);

            ko.removeNode($element[0]);
        });

        it('should write the element to the widget observable', function () {
            var $element, vm, autoOpen;

            $element = $('<div data-bind="selectmenu: { widget: widget }"></div>').prependTo('body');
            vm = { widget: ko.observable() };
            ko.applyBindings(vm, $element[0]);

            expect(vm.widget()).toBeDefined();

            ko.removeNode($element[0]);
        });

        it('should synchronize with knockout\'s value binding', function () {
            var $element, vm, autoOpen;

            $element = $([
                '<select data-bind="value: valueObservable, selectmenu: {}">',
                '  <option value="1" selected="selected">One</option>',
                '  <option value="2">Two</option>',
                '</select>'
            ].join('')).prependTo('body');
            vm = { valueObservable: ko.observable() };
            ko.applyBindings(vm, $element[0]);

            expect(vm.valueObservable()).toBe('1');

            // selectmenu -> value
            $('.ui-selectmenu-button').click();
            $('.ui-selectmenu-menu .ui-menu-item:nth-child(2)').trigger('mouseenter');
            $('.ui-selectmenu-menu .ui-menu-item:nth-child(2)').click();

            expect(vm.valueObservable()).toBe('2');

            // value -> selectmenu
            vm.valueObservable('1');

            expect($('.ui-selectmenu-text').text()).toBe('One');

            ko.removeNode($element[0]);
        });
    });
}());
