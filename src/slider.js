/*global $, ko, bindingFactory*/
(function () {
    'use strict';

    var postInit;

    postInit = function (element, valueAccessor) {
        /// <summary>Keeps the value and the values binding property in sync with the
        /// slider widget's values.</summary>
        /// <param name='element' type='DOMNode'></param>
        /// <param name='valueAccessor' type='Function'></param>

        var value = valueAccessor();

        var changeEvent = value.realtime ? 'slide' : 'slidechange';
        if (ko.isWriteableObservable(value.value)) {
            /*jslint unparam:true*/
            $(element).on(changeEvent + '.slider', function (ev, ui) {
                var $handles = $(element).find('.ui-slider-handle');
                if ($handles[0] === ui.handle) {
                    value.value(ui.value);
                }
            });
            /*jslint unparam:false*/
        }
        if (ko.isWriteableObservable(value.values)) {
            $(element).on(changeEvent + '.slider', function (ev, ui) {
                value.values(ui.values);
            });
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