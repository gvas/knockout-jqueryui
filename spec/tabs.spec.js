/*global ko, $, jasmine, describe, it, beforeEach, afterEach, spyOn, expect*/
/*jslint maxlen:256*/
(function () {
    'use strict';

    describe('The tabs binding', function () {
        it('should handle each option of the widget', function () {
            var $element, vm;

            testWidgetOptions('tabs', {
                collapsible: [false, true],
                disabled: [false, true],
                event: ['click', 'mouseover'],
                heightStyle: ['content', 'auto'],
                hide: [null, false],
                show: [null, false]
            });

            // the active option requires extra care
            $element = $('<div data-bind="tabs: { active: active }"><ul><li><a href="#tabs1">a</a></li><li><a href="#tabs2">b</a></li></ul><div id="tabs1"></div><div id="tabs2"></div></div>').appendTo('body'); ;
            vm = { active: ko.observable(0) };
            ko.applyBindings(vm);

            jasmine.log('option: active');
            expect($element.tabs('option', 'active')).toEqual(0);
            vm.active(1);
            expect($element.tabs('option', 'active')).toEqual(1);

            ko.removeNode($element[0]);
        });

        it('should handle each event of the widget', function () {
            var $element, vm;

            $element = $('<div data-bind="tabs: { create: createEventHandler }"></div>').appendTo('body');
            vm = { createEventHandler: jasmine.createSpy() };

            ko.applyBindings(vm);

            expect(vm.createEventHandler).toHaveBeenCalled();

            ko.removeNode($element[0]);
        });

        it('should write the index of the widget\'s active tab to the viewmodel\'s bound property when it changes.', function () {
            var $element, vm;

            $element = $('<div data-bind="tabs: { active: active }"><ul><li><a href="#tabs1">a</a></li><li><a href="#tabs2">b</a></li></ul><div id="tabs1"></div><div id="tabs2"></div></div>').appendTo('body'); ;
            vm = { active: ko.observable(0) };
            ko.applyBindings(vm);

            expect(vm.active.peek()).toEqual(0);
            $element.tabs('option', 'active', 1);
            expect(vm.active.peek()).toEqual(1);

            ko.removeNode($element[0]);
        });
    });
}());