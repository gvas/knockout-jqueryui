/*jslint maxlen:256*/
/*global ko, $, jasmine, describe, it, beforeEach, afterEach, spyOn, expect, getMajorMinorVersion, testWidgetOptions*/
(function () {
    'use strict';

    describe('The tabs binding', function () {

        var testOptions18, testOptions, testSelectedOption, testActiveOption, testEvents, testWidget, testNested18, testNested;

        testOptions18 = function () {

            testWidgetOptions('tabs', {
                ajaxOptions: [null, { async: false}],
                cache: [false, true],
                collapsible: [false, true],
                disabled: [[], []], // in jQuery UI 1.8 the disabled option only accepts arrays (contrary to what its documentation says)
                event: ['click', 'mouseover'],
                fx: [null, { height: "toggle", duration: 200}],
                idPrefix: ['ui-tabs-', 'ui-tabs-54'],
                panelTemplate: ['<div></div>', '<p></p>'],
                spinner: ['<em>Loading&#8230;</em>', '<em>Please wait&#8230;</em>'],
                tabTemplate: ['<li><a href="#{href}"><span>#{label}</span></a></li>', '<li><a href="#{href}"><label>#{label}</label></a></li>']
            });
        };

        testOptions = function () {

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

            $element = $('<div data-bind="tabs: { selected: selected }"><ul><li><a href="#tabs1">a</a></li><li><a href="#tabs2">b</a></li></ul><div id="tabs1"></div><div id="tabs2"></div></div>').prependTo('body');
            vm = { selected: ko.observable(0) };
            ko.applyBindings(vm, $element[0]);

            expect($element.tabs('option', 'selected')).toEqual(0);
            vm.selected(1);
            expect($element.tabs('option', 'selected')).toEqual(1);

            ko.removeNode($element[0]);
        };

        testActiveOption = function () {
            // the active option requires extra care
            var $element, vm;

            $element = $('<div data-bind="tabs: { active: active }"><ul><li><a href="#tabs1">a</a></li><li><a href="#tabs2">b</a></li></ul><div id="tabs1"></div><div id="tabs2"></div></div>').prependTo('body');
            vm = { active: ko.observable(0) };
            ko.applyBindings(vm, $element[0]);

            expect($element.tabs('option', 'active')).toEqual(0);
            vm.active(1);
            expect($element.tabs('option', 'active')).toEqual(1);
            $element.tabs('option', 'active', 0);
            expect(vm.active.peek()).toEqual(0);

            ko.removeNode($element[0]);
        };

        testEvents = function () {
            var $element, vm;

            $element = $('<div data-bind="tabs: { create: createEventHandler }"></div>').prependTo('body');
            vm = { createEventHandler: jasmine.createSpy() };

            ko.applyBindings(vm, $element[0]);

            expect(vm.createEventHandler).toHaveBeenCalled();

            ko.removeNode($element[0]);
        };


        testWidget = function () {
            var $element, vm, collapsible;

            $element = $('<div data-bind="tabs: { widget: widget, collapsible: true }"></div>').prependTo('body');
            vm = { widget: ko.observable() };
            ko.applyBindings(vm, $element[0]);

            expect(vm.widget()).toBeDefined();

            collapsible = vm.widget().tabs('option', 'collapsible');

            expect(collapsible).toBe(true);

            ko.removeNode($element[0]);
        };

        testNested18 = function () {
            var $element, vm;

            $element = $('<div data-bind="tabs: { selected: outerSelected }">' +
                '  <ul>' +
                '    <li><a href="#outer1">a</a></li>' +
                '    <li><a href="#outer2">b</a></li>' +
                '  </ul>' +
                '  <div id="outer1">' +
                '    <div data-bind="tabs: { selected: innerSelected }">' +
                '      <ul>' +
                '        <li><a href="#inner1">a</a></li>' +
                '        <li><a href="#inner2">b</a></li>' +
                '      </ul>' +
                '      <div id="inner1"></div>' +
                '      <div id="inner2"></div>' +
                '    </div>' +
                '  </div>' +
                '  <div id="outer2"></div>' +
                '</div>').prependTo('body');

            vm = {
                outerSelected: ko.observable(0),
                innerSelected: ko.observable(0)
            };

            ko.applyBindings(vm, $element[0]);

            expect(vm.outerSelected()).toEqual(0);
            expect(vm.innerSelected()).toEqual(0);

            $element.find('a[href$="#inner2"]').click();

            expect(vm.outerSelected()).toEqual(0);
            expect(vm.innerSelected()).toEqual(1);

            ko.removeNode($element[0]);
        };

        testNested = function () {
            var $element, vm;

            $element = $('<div data-bind="tabs: { active: outerActive }">' +
                '  <ul>' +
                '    <li><a href="#outer1">a</a></li>' +
                '    <li><a href="#outer2">b</a></li>' +
                '  </ul>' +
                '  <div id="outer1">' +
                '    <div data-bind="tabs: { active: innerActive }">' +
                '      <ul>' +
                '        <li><a href="#inner1">a</a></li>' +
                '        <li><a href="#inner2">b</a></li>' +
                '      </ul>' +
                '      <div id="inner1">a</div>' +
                '      <div id="inner2">b</div>' +
                '    </div>' +
                '  </div>' +
                '  <div id="outer2">b</div>' +
                '</div>').prependTo('body');

            vm = {
                outerActive: ko.observable(0),
                innerActive: ko.observable(0)
            };

            ko.applyBindings(vm, $element[0]);

            expect(vm.outerActive()).toEqual(0);
            expect(vm.innerActive()).toEqual(0);

            $element.find('a[href$="#inner2"]').click();

            expect(vm.outerActive()).toEqual(0);
            expect(vm.innerActive()).toEqual(1);

            ko.removeNode($element[0]);
        };

        /*jslint white:true*/
        switch (getMajorMinorVersion($.ui.version)) {
            case '1.8':
                it('should handle each option of the widget', testOptions18);
                it('should handle the selected option', testSelectedOption);
                it('should handle each event of the widget', testEvents);
                it('should write the element to the widget observable', testWidget);
                it('should be able to handle nested tabs', testNested18);
                break;
            default:
                it('should handle each option of the widget', testOptions);
                it('should handle the active option', testActiveOption);
                it('should handle each event of the widget', testEvents);
                it('should write the element to the widget observable', testWidget);
                it('should be able to handle nested tabs', testNested);
                break;
        }
        /*jslint white:false*/
    });
}());
