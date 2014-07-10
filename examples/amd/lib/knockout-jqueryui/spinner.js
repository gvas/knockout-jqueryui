/*global define*/
define(

    [
        'jquery',
        'knockout',
        './bindingHandler',
        './utils',
        'jquery-ui/spinner'
    ],

    function ($, ko, BindingHandler, utils) {

        'use strict';

        var Spinner = function () {
            /// <summary>Constructor.</summary>

            BindingHandler.call(this, 'spinner');

            this.widgetEventPrefix = 'spin';
            this.options = ['culture', 'disabled', 'icons', 'incremental', 'max', 'min',
                'numberFormat', 'page', 'step'];
            this.events = ['create', 'start', 'spin', 'stop', 'change'];
        };

        Spinner.prototype = utils.createObject(BindingHandler.prototype);
        Spinner.prototype.constructor = Spinner;

        Spinner.prototype.init = function (element, valueAccessor, allBindingsAccessor) {
            /// <summary>Keeps the value binding property in sync with the spinner's
            /// value.</summary>
            /// <param name='element' type='DOMNode'></param>
            /// <param name='valueAccessor' type='Function'></param>
            /// <param name='allBindingsAccessor' type='Function'></param>

            var widgetName, value;

            BindingHandler.prototype.init.apply(this, arguments);

            widgetName = this.widgetName;
            value = valueAccessor();

            if (value.value) {
                ko.computed({
                    read: function () {
                        $(element)[widgetName]('value',
                            ko.utils.unwrapObservable(value.value));
                    },
                    disposeWhenNodeIsRemoved: element
                });
            }

            // If 'value' is an observable writeable, then add an event handler so that
            // when the spinner  increments/decrements the 'value' observable can be
            // mutated.
            // Which event we listen for depends upon if any of the KO valueUpdate options
            // have been specified.
            // 1. When there is no valueUpdate in the binding, 'value' will be mutated in
            //    response to the 'spinchange' event which occurs whenever the input loses
            //    focus.
            // 2. If any of the KO valueUpdate options ("keyup", "keypress",
            //    "afterkeydown") are specified in the binding,  this implies that you
            //    wish to mutate the 'value' observable in real-time. In this case the
            //    'spin' event is used so that 'value' can be updated everytime there is
            //    an inc/dec, and done so immediately.
            if (ko.isWriteableObservable(value.value)) {
                if (allBindingsAccessor().valueUpdate) {
                    /*jslint unparam:true*/
                    this.on(element, 'spin', function (ev, ui) {
                        value.value(ui.value);
                    });
                    /*jslint unparam:false*/
                } else {
                    this.on(element, 'change', function () {
                        value.value($(element)[widgetName]('value'));
                    });
                }
            }

            // the inner elements have already been taken care of
            return { controlsDescendantBindings: true };
        };

        utils.register(Spinner);

        return Spinner;
    }
);
