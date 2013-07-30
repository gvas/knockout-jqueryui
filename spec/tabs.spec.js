/*jslint maxlen:256*/
/*global ko, $, jasmine, describe, it, beforeEach, afterEach, spyOn, expect, getMajorMinorVersion, testWidgetOptions*/
(function () {
    'use strict';

    describe('The tabs binding', function () {

        var testOptions18, testOptions19, testSelectedOption, testActiveOption, testEvents, testWidget;

        testOptions18 = function () {

            testWidgetOptions('tabs', {
                ajaxOptions: [null, { async: false}],
                cache: [false, true],
                collapsible: [false, true],
                disable: [false, true],
                event: ['click', 'mouseover'],
                fx: [null, { height: "toggle", duration: 200}],
                idPrefix: ['ui-tabs-', 'ui-tabs-54'],
                panelTemplate: ['<div></div>', '<p></p>'],
                spinner: ['<em>Loading&#8230;</em>', '<em>Please wait&#8230;</em>'],
                tabTemplate: ['<li><a href="#{href}"><span>#{label}</span></a></li>', '<li><a href="#{href}"><label>#{label}</label></a></li>']
            });
        };

        testOptions19 = function () {

            testWidgetOptions('tabs', {
                collapsible: [false, true],
                disabled: [false, true],
                event: ['click', 'mouseover'],
                heightStyle: ['content', 'auto'],
                hide: [null, false],
                show: [null, false]
            });
        };

        testSelectedOption = function () {
            // the selected option requires extra care
            var $element, vm;

            $element = $('<div data-bind="tabs: { selected: selected }"><ul><li><a href="#tabs1">a</a></li><li><a href="#tabs2">b</a></li></ul><div id="tabs1"></div><div id="tabs2"></div></div>').appendTo('body');
            vm = { selected: ko.observable(0) };
            ko.applyBindings(vm);

            jasmine.log('option: selected');
            expect($element.tabs('option', 'selected')).toEqual(0);
            vm.selected(1);
            expect($element.tabs('option', 'selected')).toEqual(1);

            ko.removeNode($element[0]);
        };

        testActiveOption = function () {
            // the active option requires extra care
            var $element, vm;

            $element = $('<div data-bind="tabs: { active: active }"><ul><li><a href="#tabs1">a</a></li><li><a href="#tabs2">b</a></li></ul><div id="tabs1"></div><div id="tabs2"></div></div>').appendTo('body');
            vm = { active: ko.observable(0) };
            ko.applyBindings(vm);

            jasmine.log('option: active');
            expect($element.tabs('option', 'active')).toEqual(0);
            vm.active(1);
            expect($element.tabs('option', 'active')).toEqual(1);
            $element.tabs('option', 'active', 0);
            expect(vm.active.peek()).toEqual(0);

            ko.removeNode($element[0]);
        };

        testEvents = function () {
            var $element, vm;

            $element = $('<div data-bind="tabs: { create: createEventHandler }"></div>').appendTo('body');
            vm = { createEventHandler: jasmine.createSpy() };

            ko.applyBindings(vm);

            expect(vm.createEventHandler).toHaveBeenCalled();

            ko.removeNode($element[0]);
        };


        testWidget = function () {
            var $element, vm, disabled;

            $element = $('<div data-bind="tabs: { widget: widget, disabled: true }"></div>').appendTo('body');
            vm = { widget: ko.observable() };
            ko.applyBindings(vm);

            expect(vm.widget()).toBeDefined();

            disabled = vm.widget().tabs('option', 'disabled');

            expect(disabled).toBe(true);

            ko.removeNode($element[0]);
        };

        /*jslint white:true*/
        switch (getMajorMinorVersion($.ui.version)) {
            case '1.8':
                it('should handle each option of the widget', testOptions18);
                it('should handle the selected option', testSelectedOption);
                it('should handle each event of the widget', testEvents);
                it('should write the element to the widget observable', testWidget);
                break;
            case '1.9':
            case '1.10':
                it('should handle each option of the widget', testOptions19);
                it('should handle the active option', testActiveOption);
                it('should handle each event of the widget', testEvents);
                it('should write the element to the widget observable', testWidget);
                break;
        }
        /*jslint white:false*/
    });
}());