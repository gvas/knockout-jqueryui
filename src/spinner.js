/*global $, ko, kojqui*/
(function () {
    'use strict';

    var postInit;

    postInit = function (element, valueAccessor) {
        /// <summary>Keeps the value binding property in sync with the spinner's value.
        /// </summary>
        /// <param name='element' type='DOMNode'></param>
        /// <param name='valueAccessor' type='Function'></param>

        var value = valueAccessor();

        if (value.value) {
            ko.computed({
                read: function () {
                    $(element).spinner('value', ko.utils.unwrapObservable(value.value));
                },
                disposeWhenNodeIsRemoved: element
            });
        }

        if (ko.isWriteableObservable(value.value)) {
            $(element).on('spinchange.ko', function () {
                value.value($(element).spinner('value'));
            });
        }

        //handle disposal
        ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
            $(element).off('ko');
        });
    };

    kojqui.bindingFactory.create({
        name: 'spinner',
        options: ['culture', 'disabled', 'icons', 'incremental', 'max', 'min',
            'numberFormat', 'page', 'step'],
        events: ['create', 'start', 'spin', 'stop', 'change'],
        postInit: postInit
    });
}());