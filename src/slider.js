/*global $, ko*/
(function () {
    'use strict';

    var postInit;

    postInit = function (element, valueAccessor) {
        /// <summary>Keeps the active binding property in sync with the tabs' state.
        /// </summary>
        /// <param name='element' type='DOMNode'></param>
        /// <param name='valueAccessor' type='Function'></param>

        var value = valueAccessor();

        if (ko.isWriteableObservable(value.value)) {
            /*jslint unparam:true*/
            $(element).on('slidechange.ko', function (ev, ui) {
                value.value(ui.value);
            });
            /*jslint unparam:false*/
        }
        if (ko.isWriteableObservable(value.values)) {
            $(element).on('slidechange.ko', function () {
                var values = $(element).slider('values');
                value.values(values);
            });
        }

        //handle disposal
        ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
            $(element).off('ko');
        });
    };

    ko.jqueryui.bindingFactory.create({
        name: 'slider',
        options: ['animate', 'disabled', 'max', 'min', 'orientation', 'range', 'step',
            'value', 'values'],
        events: ['create', 'start', 'slide', 'change', 'stop'],
        postInit: postInit
    });
}());