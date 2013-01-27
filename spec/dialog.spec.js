/*global ko, $, jasmine, describe, it, beforeEach, afterEach, spyOn, expect*/
/*jslint maxlen:256*/
(function () {
    'use strict';

    describe('The dialog binding', function () {
        it('should handle each option of the widget', function () {
            testWidgetOptions('dialog', {
                autoOpen: [true, false],
                buttons: [{}, { Ok: function () { } }],
                closeOnEscape: [true, false],
                closeText: ['Close', 'foo'],
                dialogClass: ['', 'bar'],
                draggable: [true, false],
                height: ['auto', 100],
                hide: [null, 3],
                maxHeight: [false, 100],
                maxWidth: [false, 100],
                minHeight: [150, 100],
                minWidth: [150, 100],
                modal: [false, true],
                position: [{ my: 'center', at: 'center', of: window }, 'center'],
                resizable: [true, false],
                show: [null, 'slow'],
                stack: [true, false],
                title: ['', 'title'],
                width: [300, 175],
                zIndex: [1000, 100]
            });
        });

        it('should handle each event of the widget', function () {
            var $element, vm;

            $element = $('<div data-bind="dialog: { create: createEventHandler }"></div>').appendTo('body');
            vm = { createEventHandler: jasmine.createSpy() }

            ko.applyBindings(vm);

            expect(vm.createEventHandler).toHaveBeenCalled();

            ko.removeNode($element[0]);
        });

        it('should write the widget\'s state back to the viewmodel when opened/closed.', function () {
            var $element, vm;

            $element = $('<div data-bind="dialog: { isOpen: isOpen }"></div>').appendTo('body'); ;
            vm = { isOpen: ko.observable(false) };
            ko.applyBindings(vm);

            expect(vm.isOpen.peek()).toEqual(false);
            $element.dialog('open');
            expect(vm.isOpen.peek()).toEqual(true);

            ko.removeNode($element[0]);
        });
    });
}());