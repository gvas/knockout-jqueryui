/*jslint maxlen:256*/
/*global ko, $, jasmine, describe, it, beforeEach, afterEach, spyOn, expect, testWidgetOptions*/
(function () {
    'use strict';

    describe('The accordion binding', function () {

        it('should handle each option of the widget', function () {
            var $element, vm;

            testWidgetOptions('accordion', {
                animate: [{}, 1],
                collapsible: [false, true],
                disabled: [false, true],
                event: ['click', 'mouseover'],
                header: ['> li > :first-child,> :not(li):even', 'h3'],
                heightStyle: ['auto', 'content'],
                icons: [{ header: 'ui-icon-triangle-1-e', activeHeader: 'ui-icon-triangle-1-s' }, { header: 'ui-icon-plus', activeHeader: 'ui-icon-minus', headerSelected: 'ui-icon-minus'}]
            });

            // the active option requires extra care
            $element = $('<div data-bind="accordion: { active: active }"><h3>a</h3><div>a</div><h3>b</h3><div>b</div></div>').appendTo('body'); ;
            vm = { active: ko.observable(0) };
            ko.applyBindings(vm);

            jasmine.log('option: active');
            expect($element.accordion('option', 'active')).toEqual(0);
            vm.active(1);
            expect($element.accordion('option', 'active')).toEqual(1);

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

        it('should write the active panel\'s index to the viewmodel\'s bound property.', function () {
            var $element, vm;

            $element = $('<div data-bind="accordion: { active: active, animate: false }"><h3>a</h3><div>a</div><h3>b</h3><div>b</div></div>').appendTo('body'); ;
            vm = { active: ko.observable(0) };
            ko.applyBindings(vm);
            $element.accordion('option', 'active', 1);

            expect(vm.active.peek()).toEqual(1);

            ko.removeNode($element[0]);
        });

        it('should write false to the viewmodel\s bound property when the panels collapse.', function () {
            var $element, vm;

            $element = $('<div data-bind="accordion: { active: active, animate: false, collapsible: true }"><h3>a</h3><div>a</div><h3>b</h3><div>b</div></div>').appendTo('body'); ;
            vm = { active: ko.observable(0) };
            ko.applyBindings(vm);
            $element.accordion('option', 'active', false);

            expect(vm.active.peek()).toEqual(false);

            ko.removeNode($element[0]);
        });
    });
} ());