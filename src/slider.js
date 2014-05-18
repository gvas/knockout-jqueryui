/*global $, ko, bindingFactory*/
(function () {
    'use strict';

    var domDataKey, postInit;

    domDataKey = '__kojqui_options';

    postInit = function (element, valueAccessor) {
        /// <summary>Keeps the value and the values binding property in sync with the
        /// slider widget's values.</summary>
        /// <param name='element' type='DOMNode'></param>
        /// <param name='valueAccessor' type='Function'></param>

        var value, changeEvent;

        value = valueAccessor();
        changeEvent = value.realtime ? 'slide' : 'slidechange';

        if (ko.isWriteableObservable(value.value)) {
            /*jslint unparam:true*/
            $(element).on(changeEvent + '.slider', function (ev, ui) {
                var index = $(element).find('.ui-slider-handle').index(ui.handle);
                if (index === 0) {
                    // The slider widget, in its _slide() method, raises the
                    // slide/slidechange events, then immediately updates its value
                    // property. If any of the hooked event handlers sets the widget's
                    // value property, it will ruin the sliding animation.
                    // To prevent this, we make the update() method defined in the
                    // bindingFactory to believe that the new value is already set on the
                    // widget.
                    ko.utils.domData.get(element, domDataKey).value = ui.value;
                    value.value(ui.value);
                }
            });
            /*jslint unparam:false*/
        }
        if (ko.isWriteableObservable(value.values)) {
            /*jslint unparam:true*/
            $(element).on(changeEvent + '.slider', function (ev, ui) {
                // see the explanation above
                ko.utils.domData.get(element, domDataKey).value = ui.values;
                value.values(ui.values);
            });
            /*jslint unparam:false*/
        }

        //handle disposal
        ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
            $(element).off('.slider');
        });
    };

    bindingFactory.create({
        name: 'slider',
        options: ['animate', 'disabled', 'max', 'min', 'orientation', 'range', 'step',
            'value', 'values'],
        events: ['create', 'start', 'slide', 'change', 'stop'],
        postInit: postInit
    });
}());