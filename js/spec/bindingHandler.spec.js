/*global ko, kojqui, $, jasmine, describe, it, beforeEach, afterEach, spyOn, expect*/
/*jslint maxlen:256*/
(function () {

    'use strict';

    describe('The binding handler', function () {
        var createBindingHandler, $element, match;

        afterEach(function () {
            $element.remove();
            delete $.fn.test;
            delete ko.bindingHandlers.test;
        });

        createBindingHandler = function (options, events, hasRefresh) {
            var Ctor;

            Ctor = function () {
                kojqui.BindingHandler.call(this, 'test');
                this.options = options || [];
                this.events = events || [];
                this.hasRefresh = hasRefresh || false;
            };

            Ctor.prototype = kojqui.utils.createObject(kojqui.BindingHandler.prototype);
            Ctor.prototype.constructor = Ctor;

            kojqui.utils.register(Ctor);
        };

        it('should instantiate the widget', function () {
            $element = $('<div data-bind="test: {}"></div>').prependTo('body');
            $.fn.test = jasmine.createSpy();

            createBindingHandler();

            ko.applyBindings({}, $element[0]);

            expect($.fn.test).toHaveBeenCalled();
        });

        it('should apply the descendant DOM elements\' bindings before instantiating the widget', function () {
            var $descendant;

            $element = $('<div data-bind="test: {}"></div>').prependTo('body');
            $descendant = $('<span data-bind="descendantBindingHandler: {}"></span>').prependTo($element);
            ko.bindingHandlers.descendantBindingHandler = jasmine.createSpyObj('descendantBindingHandler', ['init']);

            $.fn.test = function () {
                expect(ko.bindingHandlers.descendantBindingHandler.init).toHaveBeenCalled();
            };

            createBindingHandler();

            ko.applyBindings({}, $element[0]);

            delete ko.bindingHandlers.descendantBindingHandler;
        });

        it('should not throw any exception when a foreach binding is applied to the same element', function () {

            var $element = $('<div data-bind="foreach: [], test: {}"></div>').prependTo('body');

            $.fn.test = function () { };

            createBindingHandler();

            ko.applyBindings({}, $element[0]);
        });

        match = ko.version.match(/^(\d)\.(\d+)/);
        if (match && parseInt(match[1], 10) >= 3) {
            it('should instantiate the widget after the standard foreach binding is processed', function () {

                var $element;

                $element = $('<div data-bind="test: {}, foreach: []"></div>').prependTo('body');

                spyOn(ko.bindingHandlers.foreach, 'init').andCallThrough();

                $.fn.test = function () {
                    expect(ko.bindingHandlers.foreach.init).toHaveBeenCalled();
                };

                createBindingHandler();

                ko.applyBindings({}, $element[0]);
            });
        }

        it('should set the options specified in the binding on the widget', function () {
            var vm;

            $element = $('<div data-bind="test: { foo: fooObservable }"></div>').prependTo('body');
            vm = { fooObservable: ko.observable(1) };

            $.fn.test = jasmine.createSpy();

            createBindingHandler(['foo']);

            ko.applyBindings(vm, $element[0]);

            expect($.fn.test).toHaveBeenCalledWith({ foo: vm.fooObservable() });
        });

        it('should bind the event handlers to the viewmodel', function () {
            var vm, called, callback;

            $element = $('<div data-bind="test: { bar: barEventHandler }"></div>').prependTo('body');
            vm = {
                barEventHandler: function () {
                    called = true;
                    expect(this).toBe(vm);
                }
            };

            $.fn.test = function (arg) {
                if (arg === 'trigger') {
                    callback();
                } else {
                    callback = arg.bar;
                }
            };

            createBindingHandler([], ['bar']);

            ko.applyBindings(vm, $element[0]);

            $.fn.test('trigger');

            expect(called).toBe(true);
        });

        it('should support expressions in the options\' values', function () {
            var vm;

            $element = $('<div data-bind="test: { foo: fooObservable() + 1 }"></div>').prependTo('body');
            vm = { fooObservable: ko.observable(1) };

            $.fn.test = jasmine.createSpy();

            createBindingHandler(['foo']);

            ko.applyBindings(vm, $element[0]);

            expect($.fn.test).toHaveBeenCalledWith({ foo: 2 });

            vm.fooObservable(2);

            expect($.fn.test).toHaveBeenCalledWith('option', 'foo', 3);
        });

        it('should unwrap the observable options before passing them to the widget', function () {
            var vm;

            $element = $('<div data-bind="test: { foo: fooObservable }"></div>').prependTo('body');
            vm = { fooObservable: ko.observable(1) };

            $.fn.test = jasmine.createSpy();

            createBindingHandler(['foo']);

            ko.applyBindings(vm, $element[0]);

            expect($.fn.test).toHaveBeenCalledWith({ foo: 1 });
        });

        it('should set the widget\'s corresponding option when one of the binding\'s observable option changes', function () {
            var vm;

            $element = $('<div data-bind="test: { foo: fooObservable }"></div>').prependTo('body');
            vm = { fooObservable: ko.observable(1) };

            $.fn.test = jasmine.createSpy();

            createBindingHandler(['foo']);

            ko.applyBindings(vm, $element[0]);

            expect($element.test).not.toHaveBeenCalledWith('option', 'foo', 2);
            vm.fooObservable(2);
            expect($element.test).toHaveBeenCalledWith('option', 'foo', 2);
        });

        it('should only set those widget options which has been changed', function () {
            var vm;

            $element = $('<div data-bind="test: { foo: foo, bar: bar }"></div>').prependTo('body');
            vm = {
                foo: ko.observable(1),
                bar: ko.observable('one')
            };

            $.fn.test = jasmine.createSpy();

            createBindingHandler(['foo', 'bar']);

            ko.applyBindings(vm, $element[0]);

            $.fn.test.reset();
            vm.foo(2);

            expect($element.test).toHaveBeenCalledWith('option', 'foo', 2);
            expect($element.test).not.toHaveBeenCalledWith('option', 'bar', jasmine.any(Object));
        });

        it('should refresh the widget when the refreshOn observable changes', function () {
            var vm;

            $element = $('<div data-bind="test: { refreshOn: refreshOnObservable }"></div>').prependTo('body');
            vm = { refreshOnObservable: ko.observable() };

            $.fn.test = jasmine.createSpy();

            createBindingHandler([], [], true);

            ko.applyBindings(vm, $element[0]);

            vm.refreshOnObservable(1);
            expect($element.test).toHaveBeenCalledWith('refresh');
        });

        it('should not refresh the widget when the hasRefresh option is falsy', function () {
            var vm;

            $element = $('<div data-bind="test: { refreshOn: refreshOnObservable }"></div>').prependTo('body');
            vm = { refreshOnObservable: ko.observable() };

            $.fn.test = jasmine.createSpy();

            createBindingHandler();

            ko.applyBindings(vm, $element[0]);

            vm.refreshOnObservable(1);
            expect($element.test).not.toHaveBeenCalledWith('refresh');
        });

        it('should set the view model\'s \'widget\' observable option to the widget instance', function () {
            var vm;

            $element = $('<div data-bind="test: { widget: widgetObservable }"></div>').prependTo('body');
            vm = { widgetObservable: ko.observable() };

            $.widget('ui.test', {});

            createBindingHandler();

            ko.applyBindings(vm, $element[0]);

            expect(vm.widgetObservable()).toBeDefined();
        });

        it('should destroy the widget when the DOM node is disposed', function () {
            $element = $('<div data-bind="test: {}"></div>').prependTo('body');

            $.fn.test = jasmine.createSpy();

            createBindingHandler(['foo']);

            ko.applyBindings({}, $element[0]);

            expect($.fn.test).not.toHaveBeenCalledWith('destroy');
            ko.removeNode($element[0]);
            expect($.fn.test).toHaveBeenCalledWith('destroy');
        });
    });
} ());
