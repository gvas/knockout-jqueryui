/*jslint maxlen:256, browser: true*/
/*global ko, $, jasmine, describe, it, beforeEach, afterEach, spyOn, expect, getMajorMinorVersion, testWidgetOptions*/
(function () {
    'use strict';

    describe('The dialog binding', function () {
        it('should handle each option of the widget', function () {

            var optionsToTest = {
                autoOpen: [true, false],
                buttons: [{}, { Ok: function () { } }],
                closeOnEscape: [true, false],
                closeText: ['Close', 'foo'],
                dialogClass: ['', 'bar'],
                draggable: [true, false],
                height: ['auto', 100],
                maxHeight: [false, 100],
                maxWidth: [false, 100],
                minHeight: [150, 100],
                minWidth: [150, 100],
                modal: [false, true],
                position: [{ my: 'center', at: 'center', of: window }, 'center'],
                resizable: [true, false],
                show: [null, 'slow'],
                title: ['', 'title'],
                width: [300, 175]
            };

            /*jslint white:true*/
            switch (getMajorMinorVersion($.ui.version)) {
                case '1.8':
                    $.extend(optionsToTest, {
                        disabled: [true, false],
                        stack: [true, false],
                        zIndex: [1000, 100]
                    });
                    break;
                case '1.9':
                    $.extend(optionsToTest, {
                        hide: [null, 3],
                        stack: [true, false],
                        zIndex: [1000, 100]
                    });
                    break;
                case '1.10':
                    $.extend(optionsToTest, {
                        hide: [null, 3]
                    });
                    break;
            }
            /*jslint white:false*/

            testWidgetOptions('dialog', optionsToTest);
        });

        it('should handle each event of the widget', function () {
            var $element, vm;

            $element = $('<div data-bind="dialog: { create: createEventHandler }"></div>').appendTo('body');
            vm = { createEventHandler: jasmine.createSpy() };

            ko.applyBindings(vm);

            expect(vm.createEventHandler).toHaveBeenCalled();

            ko.removeNode($element[0]);
        });

        it('should write the widget\'s state back to the viewmodel when opened/closed.', function () {
            var $element, vm;

            $element = $('<div data-bind="dialog: { isOpen: isOpen }"></div>').appendTo('body');
            vm = { isOpen: ko.observable(false) };
            ko.applyBindings(vm);

            expect(vm.isOpen.peek()).toEqual(false);
            $element.dialog('open');
            expect(vm.isOpen.peek()).toEqual(true);

            ko.removeNode($element[0]);
        });

        it('should write the element to the widget observable', function () {
            var $element, vm, autoOpen;

            $element = $('<div data-bind="dialog: { widget: widget, autoOpen: false }"></div>').appendTo('body');
            vm = { widget: ko.observable() };
            ko.applyBindings(vm);

            expect(vm.widget()).toBeDefined();

            autoOpen = vm.widget().dialog('option', 'autoOpen');

            expect(autoOpen).toBe(false);

            ko.removeNode($element[0]);
        });
    });
}());