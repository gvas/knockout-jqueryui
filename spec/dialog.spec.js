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
                resizable: [true, false],
                show: [null, 'slow'],
                title: ['one', 'two'],
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
                default:
                    $.extend(optionsToTest, {
                        hide: [null, 3]
                    });
                    break;
            }
            /*jslint white:false*/

            testWidgetOptions('dialog', optionsToTest);
        });

        it('should handle the position option', function () {
            var $element, vm, position;

            $element = $('<div data-bind="dialog: { position: position }"></div>').prependTo('body');
            vm = { position: ko.observable({ my: 'center', at: 'center', of: window }) };

            ko.applyBindings(vm, $element[0]);

            position = $element.dialog('option', 'position');
            expect(position.my).toEqual('center');
            expect(position.at).toEqual('center');
            expect(position.of).toEqual(window);

            vm.position({ my: "left top", at: "left bottom", of: window });

            position = $element.dialog('option', 'position');
            expect(position.my).toEqual('left top');
            expect(position.at).toEqual('left bottom');
            expect(position.of).toEqual(window);

            ko.removeNode($element[0]);
        });

        it('should handle each event of the widget', function () {
            var $element, vm;

            $element = $('<div data-bind="dialog: { create: createEventHandler }"></div>').prependTo('body');
            vm = { createEventHandler: jasmine.createSpy() };

            ko.applyBindings(vm, $element[0]);

            expect(vm.createEventHandler).toHaveBeenCalled();

            ko.removeNode($element[0]);
        });

        it('should write the widget\'s state back to the viewmodel when opened/closed.', function () {
            var $element, vm;

            $element = $('<div data-bind="dialog: { isOpen: isOpen }"></div>').prependTo('body');
            vm = { isOpen: ko.observable(false) };
            ko.applyBindings(vm, $element[0]);

            expect(vm.isOpen.peek()).toEqual(false);
            $element.dialog('open');
            expect(vm.isOpen.peek()).toEqual(true);

            ko.removeNode($element[0]);
        });

        it('should write the element to the widget observable', function () {
            var $element, vm, autoOpen;

            $element = $('<div data-bind="dialog: { widget: widget, autoOpen: false }"></div>').prependTo('body');
            vm = { widget: ko.observable() };
            ko.applyBindings(vm, $element[0]);

            expect(vm.widget()).toBeDefined();

            autoOpen = vm.widget().dialog('option', 'autoOpen');

            expect(autoOpen).toBe(false);

            ko.removeNode($element[0]);
        });

        it('should update the dialog\'s width and height observables when the widget is resized.', function () {
            var $element, vm, $handle;

            $element = $('<div data-bind="dialog: { width: width, height: height }"></div>').prependTo('body');
            vm = {
                width: ko.observable(150),
                height: ko.observable(150)
            };
            ko.applyBindings(vm, $element[0]);

            $handle = $element.parent().find('.ui-resizable-handle.ui-resizable-se');
            $handle.simulate('mouseover');
            $handle.simulate('drag', { dx: 10, dy: 20 });

            expect(Math.abs(vm.width.peek() - 160)).toBeLessThan(2);
            // there is some bug in jQuery UI, the initial height is set incorrectly
            expect(vm.height.peek()).toEqual($element.dialog('option', 'height'));

            ko.removeNode($element[0]);
        });
    });
} ());
