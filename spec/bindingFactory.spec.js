/*global ko, kojqui, $, jasmine, describe, it, beforeEach, afterEach, spyOn, expect*/
/*jslint maxlen:256*/
(function () {
    'use strict';

    describe('The binding factory', function () {
        afterEach(function () {
            delete $.fn.test;
            delete ko.bindingHandlers.test;
        });

        it('should skip non-existent widgets', function () {
            ko.jqui.bindingFactory.create({
                name: 'test',
                options: [],
                events: []
            });

            expect(ko.bindingHandlers.test).not.toBeDefined();
        });

        it('should create binding for an existing widget', function () {
            $.fn.test = jasmine.createSpy();
            ko.jqui.bindingFactory.create({
                name: 'test',
                options: [],
                events: []
            });

            expect(ko.bindingHandlers.test).toBeDefined();
        });
    });

    describe('The binding handler', function () {
        var $element;

        afterEach(function () {
            $element.remove();
            delete $.fn.test;
            delete ko.bindingHandlers.test;
        });

        it('should instantiate the widget', function () {
            $element = $('<div data-bind="test: {}"></div>').appendTo('body');
            $.fn.test = jasmine.createSpy();

            ko.jqui.bindingFactory.create({
                name: 'test',
                options: [],
                events: []
            });

            ko.applyBindings({});

            expect($.fn.test).toHaveBeenCalled();
        });

        it('should prevent applying the binding multiple times', function () {
            $element = $('<div data-bind="test: {}"></div>').appendTo('body');
            $.fn.test = jasmine.createSpy();

            ko.jqui.bindingFactory.create({
                name: 'test',
                options: [],
                events: []
            });

            ko.applyBindings({});
            ko.applyBindings({});

            expect($.fn.test.callCount).toEqual(1);
        });

        it('should invoke the preInit callback before the widget instantiation', function () {
            $element = $('<div data-bind="test: {}"></div>').appendTo('body');
            $.fn.test = jasmine.createSpy();

            ko.jqui.bindingFactory.create({
                name: 'test',
                options: [],
                events: [],
                preInit: function () {
                    expect($.fn.test).not.toHaveBeenCalled();
                }
            });

            ko.applyBindings({});
        });

        it('should invoke the postInit callback after the widget instantiation', function () {
            $element = $('<div data-bind="test: {}"></div>').appendTo('body');
            $.fn.test = jasmine.createSpy();

            ko.jqui.bindingFactory.create({
                name: 'test',
                options: [],
                events: [],
                postInit: function () {
                    expect($.fn.test).toHaveBeenCalled();
                }
            });

            ko.applyBindings({});
        });

        it('should apply the descendant DOM elements\' bindings before instantiating the widget', function () {
            var $descendant;

            $element = $('<div data-bind="test: {}"></div>').appendTo('body');
            $descendant = $('<span data-bind="descendantBindingHandler: {}"></span>').appendTo($element);
            ko.bindingHandlers.descendantBindingHandler = jasmine.createSpyObj('descendantBindingHandler', ['init']);

            $.fn.test = function () {
                expect(ko.bindingHandlers.descendantBindingHandler.init).toHaveBeenCalled();
            };

            ko.jqui.bindingFactory.create({
                name: 'test',
                options: [],
                events: []
            });

            ko.applyBindings({});

            delete ko.bindingHandlers.descendantBindingHandler;
        });

        it('should set the options and events specified in the binding on the widget', function () {
            var vm;

            $element = $('<div data-bind="test: { foo: fooObservable, bar: barEventHandler }"></div>').appendTo('body');
            vm = { fooObservable: ko.observable(1), barEventHandler: function () { } };

            $.fn.test = jasmine.createSpy();

            ko.jqui.bindingFactory.create({
                name: 'test',
                options: ['foo'],
                events: ['bar']
            });

            ko.applyBindings(vm);

            expect($.fn.test).toHaveBeenCalledWith({ foo: vm.fooObservable(), bar: vm.barEventHandler });
        });

        it('should unwrap the observable options before passing them to the widget', function () {
            var vm;

            $element = $('<div data-bind="test: { foo: fooObservable }"></div>').appendTo('body');
            vm = { fooObservable: ko.observable(1) };

            $.fn.test = jasmine.createSpy();

            ko.jqui.bindingFactory.create({
                name: 'test',
                options: ['foo'],
                events: []
            });

            ko.applyBindings(vm);

            expect($.fn.test).toHaveBeenCalledWith({ foo: 1 });
        });

        it('should set the widget\'s corresponding option when one of the binding\'s observable option changes', function () {
            var vm;

            $element = $('<div data-bind="test: { foo: fooObservable }"></div>').appendTo('body');
            vm = { fooObservable: ko.observable(1) };

            $.fn.test = jasmine.createSpy();

            ko.jqui.bindingFactory.create({
                name: 'test',
                options: ['foo'],
                events: []
            });

            ko.applyBindings(vm);

            expect($element.test).not.toHaveBeenCalledWith('option', 'foo', 2);
            vm.fooObservable(2);
            expect($element.test).toHaveBeenCalledWith('option', 'foo', 2);
        });

        it('should refresh the widget when the refreshOn observable changes', function () {
            var vm;

            $element = $('<div data-bind="test: { refreshOn: refreshOnObservable }"></div>').appendTo('body');
            vm = { refreshOnObservable: ko.observable() };

            $.fn.test = jasmine.createSpy();

            ko.jqui.bindingFactory.create({
                name: 'test',
                options: [],
                events: [],
                hasRefresh: true
            });

            ko.applyBindings(vm);

            vm.refreshOnObservable(1);
            expect($element.test).toHaveBeenCalledWith('refresh');
        });

        it('should not refresh the widget when the hasRefresh option is falsy', function () {
            var vm;

            $element = $('<div data-bind="test: { refreshOn: refreshOnObservable }"></div>').appendTo('body');
            vm = { refreshOnObservable: ko.observable() };

            $.fn.test = jasmine.createSpy();

            ko.jqui.bindingFactory.create({
                name: 'test',
                options: [],
                events: []
            });

            ko.applyBindings(vm);

            vm.refreshOnObservable(1);
            expect($element.test).not.toHaveBeenCalledWith('refresh');
        });

        it('should set the view model\'s \'widget\' observable option to the widget instance', function () {
            var vm;

            $element = $('<div data-bind="test: { widget: widgetObservable }"></div>').appendTo('body');
            vm = { widgetObservable: ko.observable() };

            $.widget('ui.test', {});

            ko.jqui.bindingFactory.create({
                name: 'test',
                options: [],
                events: []
            });

            ko.applyBindings(vm);

            expect(vm.widgetObservable()).toBeDefined();
        });

        it('should destroy the widget when the DOM node is disposed', function () {
            $element = $('<div data-bind="test: {}"></div>').appendTo('body');

            $.fn.test = jasmine.createSpy();

            ko.jqui.bindingFactory.create({
                name: 'test',
                options: [],
                events: []
            });

            ko.applyBindings({});

            expect($.fn.test).not.toHaveBeenCalledWith('destroy');
            ko.removeNode($element[0]);
            expect($.fn.test).toHaveBeenCalledWith('destroy');
        });
    });
}());