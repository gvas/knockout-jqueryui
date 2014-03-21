/*global $, ko, bindingFactory*/
(function () {
    'use strict';

    var postInit;

    postInit = function (element, valueAccessor) {
        /// <summary>Keeps the isOpen binding property in sync with the tooltip's state.
        /// </summary>
        /// <param name='element' type='DOMNode'></param>
        /// <param name='valueAccessor' type='Function'></param>

        var value = valueAccessor();

        if (value.isOpen) {
            ko.computed({
                read: function () {
                    if (ko.utils.unwrapObservable(value.isOpen)) {
                        $(element).tooltip('open');
                    } else {
                        $(element).tooltip('close');
                    }
                },
                disposeWhenNodeIsRemoved: element
            });
        }
        if (ko.isWriteableObservable(value.isOpen)) {
            $(element).on('tooltipopen.tooltip', function () {
                value.isOpen(true);
            });
            $(element).on('tooltipclose.tooltip', function () {
                value.isOpen(false);
            });
        }

        //handle disposal
        ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
            $(element).off('.tooltip');
        });
    };

    bindingFactory.create({
        name: 'tooltip',
        options: ['content', 'disabled', 'hide', 'items', 'position', 'show',
            'tooltipClass', 'track'],
        events: ['create', 'open', 'close'],
        postInit: postInit
    });
}());