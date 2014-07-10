/*global define*/
define(

    [
        'jquery',
        'knockout',
        './bindingHandler',
        './utils',
        'jquery-ui/slider'
    ],

    function ($, ko, BindingHandler, utils) {

        'use strict';

        var domDataKey, Slider;

        domDataKey = '__kojqui_options';

        Slider = function () {
            /// <summary>Constructor.</summary>

            BindingHandler.call(this, 'slider');

            this.widgetEventPrefix = 'slide';
            this.options = ['animate', 'disabled', 'max', 'min', 'orientation', 'range',
                'step', 'value', 'values'];
            this.events = ['create', 'start', 'slide', 'change', 'stop'];
        };

        Slider.prototype = utils.createObject(BindingHandler.prototype);
        Slider.prototype.constructor = Slider;

        Slider.prototype.init = function (element, valueAccessor) {
            /// <summary>Keeps the value and the values binding property in sync with the
            /// slider widget's values.</summary>
            /// <param name='element' type='DOMNode'></param>
            /// <param name='valueAccessor' type='Function'></param>

            var value, changeEvent;

            BindingHandler.prototype.init.apply(this, arguments);

            value = valueAccessor();
            changeEvent = value.realtime ? 'slide' : 'change';

            if (ko.isWriteableObservable(value.value)) {
                /*jslint unparam:true*/
                this.on(element, changeEvent, function (ev, ui) {
                    var index = $(element).find('.ui-slider-handle').index(ui.handle);
                    if (index === 0) {
                        // The slider widget, in its _slide() method, raises the
                        // slide/slidechange events, then immediately updates its value
                        // property. If any of the event handlers hooked onto the
                        // slide/slidechange event sets the widget's value property, it
                        // will ruin the sliding animation.
                        // To prevent that, we trick the update() method defined in
                        // BindingHandler to think that the value option is already
                        // updated.
                        ko.utils.domData.get(element, domDataKey).value = ui.value;
                        value.value(ui.value);
                    }
                });
                /*jslint unparam:false*/
            }
            if (ko.isWriteableObservable(value.values)) {
                /*jslint unparam:true*/
                this.on(element, changeEvent, function (ev, ui) {
                    // see the explanation above
                    ko.utils.domData.get(element, domDataKey).value = ui.values;
                    value.values(ui.values);
                });
                /*jslint unparam:false*/
            }

            // the inner elements have already been taken care of
            return { controlsDescendantBindings: true };
        };

        utils.register(Slider);

        return Slider;
    }
);
