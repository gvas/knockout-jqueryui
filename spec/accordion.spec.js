/*jslint maxlen:256*/
/*global ko, $, jasmine, describe, it, beforeEach, afterEach, spyOn, expect, testWidgetOptions, getMajorMinorVersion*/
(function () {
    'use strict';

    describe('The accordion binding', function () {

        var testIconsOption, testIconsOption18;

        it('should handle each option of the widget', function () {

            var optionsToTest = {
                collapsible: [false, true],
                disabled: [false, true],
                event: ['click', 'mouseover'],
                header: ['> li > :first-child,> :not(li):even', 'h3']
            };

            /*jslint white:true*/
            switch (getMajorMinorVersion($.ui.version)) {
                case '1.8':
                    $.extend(optionsToTest, {
                        animated: ['slide', false],
                        autoHeight: [true, false],
                        clearStyle: [false, true],
                        fillSpace: [false, true],
                        navigation: [false, true]
                    });
                    break;
                default:
                    $.extend(optionsToTest, {
                        animate: [{}, 1],
                        heightStyle: ['auto', 'content']
                    });
                    break;
            }
            /*jslint white:false*/

            testWidgetOptions('accordion', optionsToTest);
        });

        testIconsOption18 = function () {
            var $element, vm, icons;

            $element = $('<div data-bind="accordion: { icons: icons }"></div>').prependTo('body');
            vm = { icons: ko.observable({ header: 'ui-icon-triangle-1-e', headerSelected: 'ui-icon-triangle-1-s' }) };
            ko.applyBindings(vm, $element[0]);

            icons = $element.accordion('option', 'icons');
            expect(icons.header).toEqual('ui-icon-triangle-1-e');
            expect(icons.headerSelected).toEqual('ui-icon-triangle-1-s');

            vm.icons({ header: 'ui-icon-plus', headerSelected: 'ui-icon-minus' });

            icons = $element.accordion('option', 'icons');
            expect(icons.header).toEqual('ui-icon-plus');
            expect(icons.headerSelected).toEqual('ui-icon-minus');

            ko.removeNode($element[0]);
        };

        testIconsOption = function () {
            var $element, vm, icons;

            $element = $('<div data-bind="accordion: { icons: icons }"></div>').prependTo('body');
            vm = { icons: ko.observable({ header: 'ui-icon-triangle-1-e', activeHeader: 'ui-icon-triangle-1-s' }) };
            ko.applyBindings(vm, $element[0]);

            icons = $element.accordion('option', 'icons');
            expect(icons.header).toEqual('ui-icon-triangle-1-e');
            expect(icons.activeHeader).toEqual('ui-icon-triangle-1-s');

            vm.icons({ header: 'ui-icon-plus', activeHeader: 'ui-icon-minus' });

            icons = $element.accordion('option', 'icons');
            expect(icons.header).toEqual('ui-icon-plus');
            expect(icons.activeHeader).toEqual('ui-icon-minus');

            ko.removeNode($element[0]);
        };

        it('should handle the active option', function () {
            // the active option requires extra care
            var $element, vm;

            $element = $('<div data-bind="accordion: { active: active }"><h3>a</h3><div>a</div><h3>b</h3><div>b</div></div>').prependTo('body');
            vm = { active: ko.observable(0) };
            ko.applyBindings(vm, $element[0]);

            expect($element.accordion('option', 'active')).toEqual(0);
            vm.active(1);
            expect($element.accordion('option', 'active')).toEqual(1);

            ko.removeNode($element[0]);
        });

        it('should handle each event of the widget', function () {
            var $element, vm;

            $element = $('<div data-bind="accordion: { create: createEventHandler }"></div>').prependTo('body');
            vm = { createEventHandler: jasmine.createSpy() };

            ko.applyBindings(vm, $element[0]);

            expect(vm.createEventHandler).toHaveBeenCalled();

            ko.removeNode($element[0]);
        });

        it('should write the active panel\'s index to the viewmodel\'s bound property.', function () {
            var $element, vm;

            $element = $('<div data-bind="accordion: { active: active, animate: false, animated: false }"><h3>a</h3><div>a</div><h3>b</h3><div>b</div></div>').prependTo('body');
            vm = { active: ko.observable(0) };
            ko.applyBindings(vm, $element[0]);
            $element.accordion('option', 'active', 1);

            expect(vm.active.peek()).toEqual(1);

            ko.removeNode($element[0]);
        });

        it('should write false to the viewmodel\'s bound property when the panels collapse.', function () {
            var $element, vm;

            $element = $('<div data-bind="accordion: { active: active, animate: false, animated: false, collapsible: true }"><h3>a</h3><div>a</div><h3>b</h3><div>b</div></div>').prependTo('body');
            vm = { active: ko.observable(0) };
            ko.applyBindings(vm, $element[0]);
            $element.accordion('option', 'active', false);

            expect(vm.active.peek()).toEqual(false);

            ko.removeNode($element[0]);
        });

        it('should write the element to the widget observable', function () {
            var $element, vm, disabled;

            $element = $('<div data-bind="accordion: { widget: widget, disabled: true }"><h3>a</h3><div>a</div><h3>b</h3><div>b</div></div>').prependTo('body');
            vm = { widget: ko.observable() };
            ko.applyBindings(vm, $element[0]);

            expect(vm.widget()).toBeDefined();

            disabled = vm.widget().accordion('option', 'disabled');

            expect(disabled).toBe(true);

            ko.removeNode($element[0]);
        });

        /*jslint white:true*/
        switch (getMajorMinorVersion($.ui.version)) {
            case '1.8':
                it('should handle the icons option', testIconsOption18);
                break;
            default:
                it('should handle the icons option', testIconsOption);
                break;
        }
        /*jslint white:false*/
    });
}());