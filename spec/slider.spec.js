/*jslint maxlen:256*/
/*global ko, $, jasmine, describe, it, beforeEach, afterEach, spyOn, expect, testWidgetOptions*/
(function () {
    'use strict';

    var findCenter;

    findCenter = function ($el) {
        var o = $el.offset();
        return {
            x: Math.floor(o.left + $el.outerWidth() / 2),
            y: Math.floor(o.top + $el.outerHeight() / 2)
        };
    };

    describe('The slider binding', function () {
        it('should handle each option of the widget', function () {
            testWidgetOptions('slider', {
                animate: [false, 'fast'],
                disabled: [false, true],
                max: [100, 50],
                min: [0, 20],
                orientation: ['horizontal', 'vertical'],
                range: [false, true],
                step: [1, 2],
                value: [0, 10],
                values: [null, [10, 20]]
            });
        });

        it('should handle each event of the widget', function () {
            var $element, vm;

            $element = $('<div data-bind="slider: { create: createEventHandler }"></div>').prependTo('body');
            vm = { createEventHandler: jasmine.createSpy() };

            ko.applyBindings(vm, $element[0]);

            expect(vm.createEventHandler).toHaveBeenCalled();

            ko.removeNode($element[0]);
        });

        it('should write the widget\'s value to the viewmodel\'s bound property when it changes.', function () {
            var $element, vm;

            $element = $('<div data-bind="slider: { value: value }"></div>').prependTo('body');
            vm = { value: ko.observable(1) };
            ko.applyBindings(vm, $element[0]);

            expect(vm.value.peek()).toEqual(1);
            $element.slider('value', 55);
            expect(vm.value.peek()).toEqual(55);

            ko.removeNode($element[0]);
        });

        it('should write the widget\'s values to the viewmodel\'s bound property when it changes.', function () {
            var $element, vm;

            $element = $('<div data-bind="slider: { values: values }"></div>').prependTo('body');
            vm = { values: ko.observable([1, 10]) };
            ko.applyBindings(vm, $element[0]);

            expect(vm.values.peek()).toEqual([1, 10]);
            $element.slider('option', 'values', [1, 6]);
            expect(vm.values.peek()).toEqual([1, 6]);

            ko.removeNode($element[0]);
        });

        it('should write the widget\'s value to the viewmodel\'s bound property when the values option changes.', function () {
            var $element, vm;

            $element = $('<div data-bind="slider: { value: value, values: values }"></div>').prependTo('body');
            vm = {
                value: ko.observable(30),
                values: ko.observableArray([30, 60])
            };
            ko.applyBindings(vm, $element[0]);

            expect(vm.value.peek()).toEqual(30);
            $element.slider('values', [40, 60]);
            expect(vm.value.peek()).toEqual(40);

            ko.removeNode($element[0]);
        });

        it('should write the widget\'s values to the viewmodel\'s bound property upon slide event', function () {
            var $element, vm;

            $element = $('<div data-bind="slider: { values: values }"></div>').prependTo('body');
            vm = {
                values: ko.observable([30, 50])
            };
            ko.applyBindings(vm, $element[0]);

            expect(vm.values.peek()).toEqual([30, 50]);
            $element.find('.ui-slider-handle:eq(0)').simulate('drag', { dx: 1000 });
            expect(vm.values.peek()[0]).toBeGreaterThan(30);
            expect(vm.values.peek()[1]).toEqual(50);
            $element.find('.ui-slider-handle:eq(1)').simulate('drag', { dx: 1000 });
            expect(vm.values.peek()[0]).toBeGreaterThan(30);
            expect(vm.values.peek()[1]).toBeGreaterThan(50);

            ko.removeNode($element[0]);
        });

        it('should update the viewmodel\'s bound property during the mouse drag', function () {
            var $element, $handle, vm, center, coord;

            $element = $('<div data-bind="slider: { value: value, realtime: true }"></div>').prependTo('body');
            vm = {
                value: ko.observable(30)
            };
            ko.applyBindings(vm, $element[0]);

            $handle = $element.find('.ui-slider-handle:eq(0)');
            center = findCenter($handle);
            coord = { clientX: center.x, clientY: center.y };

            expect(vm.value.peek()).toEqual(30);
            $handle.simulate('mousedown', coord);
            coord.clientX += 20;
            $handle.simulate('mousemove', coord);
            expect(vm.value.peek()).toBeGreaterThan(30);
            $handle.simulate('mouseup');

            ko.removeNode($element[0]);
        });

        it('should update the viewmodel\'s bound property only when the mouse drag finishes', function () {
            var $element, $handle, vm, center, coord;

            $element = $('<div data-bind="slider: { value: value }"></div>').prependTo('body');
            vm = {
                value: ko.observable(30)
            };
            ko.applyBindings(vm, $element[0]);

            $handle = $element.find('.ui-slider-handle:eq(0)');
            center = findCenter($handle);
            coord = { clientX: center.x, clientY: center.y };

            expect(vm.value.peek()).toEqual(30);
            $handle.simulate('mousedown', coord);
            coord.clientX += 20;
            $handle.simulate('mousemove', coord);
            expect(vm.value.peek()).toEqual(30);
            $handle.simulate('mouseup');
            expect(vm.value.peek()).toBeGreaterThan(30);

            ko.removeNode($element[0]);
        });

        it('should write the element to the widget observable', function () {
            var $element, vm, disabled;

            $element = $('<div data-bind="slider: { widget: widget, disabled: true }"></div>').prependTo('body');
            vm = { widget: ko.observable() };
            ko.applyBindings(vm, $element[0]);

            expect(vm.widget()).toBeDefined();

            disabled = vm.widget().slider('option', 'disabled');

            expect(disabled).toBe(true);

            ko.removeNode($element[0]);
        });

        it('shouldn\'t set the widget\'s value option in the slide/slidechange event handler', function () {
            // ...because that would ruin the sliding animation
            var $element, vm, center, coord;

            $element = $('<div data-bind="slider: { value: value }"></div>').prependTo('body');
            vm = {
                value: ko.observable(0)
            };
            ko.applyBindings(vm, $element[0]);

            spyOn($.fn, 'slider').andCallThrough();

            center = findCenter($element);
            coord = { clientX: center.x, clientY: center.y };
            $element.simulate('mousedown', coord);
            $element.simulate('mouseup');
            expect(Math.abs(vm.value.peek() - 50)).toBeLessThan(2);
            /*jslint unparam: true*/
            $.each($.fn.slider.calls, function (idx, call) {
                expect(call.args[0] === 'option' && call.args[1] === 'value' && call.args.length === 3).not.toBe(true);
            });
            /*jslint unparam: false*/

            ko.removeNode($element[0]);
        });
    });
}());