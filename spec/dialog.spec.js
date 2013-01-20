/*global ko, $, jasmine, describe, it, beforeEach, afterEach, spyOn, expect*/
/*jslint maxlen:256*/
(function () {
    'use strict';

    describe('The dialog binding', function () {
        afterEach(function () {
            delete ko.bindingHandlers.test;
        });

        it('should handle each option of the widget', function () {
            var $element, vm;

            $element = $('<div data-bind="dialog: { autoOpen: autoOpen, buttons: buttons, '
                + 'closeOnEscape: closeOnEscape, closeText: closeText, dialogClass: dialogClass, '
                + 'draggable: draggable, height: height, hide: hide, maxHeight: maxHeight, '
                + 'maxWidth: maxWidth, minHeight: minHeight, minWidth: minWidth, modal: modal, '
                + 'position: position, resizable: resizable, show: show, stack: stack, title: title, '
                + 'width: width, zIndex: zIndex }"></div>').appendTo('body');
            vm = {
                autoOpen: false,
                buttons: { Ok: function () { } },
                closeOnEscape: false,
                closeText: 'foo',
                dialogClass: 'bar',
                draggable: false,
                height: 100,
                hide: 3,
                maxHeight: 100,
                maxWidth: 100,
                minHeight: 100,
                minWidth: 100,
                modal: true,
                position: 'center',
                resizable: false,
                show: 'slow',
                stack: false,
                title: 'title',
                width: 100,
                zIndex: 100
            };

            ko.applyBindings(vm);

            ko.utils.arrayForEach(['autoOpen', 'buttons', 'closeOnEscape', 'closeText', 'dialogClass',
                'draggable', 'height', 'hide', 'maxHeight', 'maxWidth', 'minHeight',
                'minWidth', 'modal', 'position', 'resizable', 'show', 'stack', 'title',
                'width', 'zIndex'], function (optionName) {
                expect($element.dialog('option', optionName)).toEqual(vm[optionName]);
            });

            ko.removeNode($element[0]);
        });

        it('should handle each event of the widget', function () {
            var $element, vm;

            $element = $('<div data-bind="dialog: { create: createEventHandler }"></div>').appendTo('body');
            vm = { createEventHandler: jasmine.createSpy() }

            ko.applyBindings(vm);

            expect(vm.createEventHandler).toHaveBeenCalled();

            ko.removeNode($element[0]);
        });
    });
}());