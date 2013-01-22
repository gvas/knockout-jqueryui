/*global $, ko*/
/*jslint maxlen:256*/
(function () {
    'use strict';

    var postInit;

    postInit = function (element, valueAccessor) {
        /// <summary>Keeps the active binding property in sync with the tabs' state.</summary>
        /// <param name='element' type='DOMNode'></param>
        /// <param name='valueAccessor' type='Function'></param>

        var value = valueAccessor();

        if (ko.isWriteableObservable(value.active)) {
            /*jslint unparam:true*/
            $(element).on('accordionactivate.ko', function (ev, ui) {
                var headerSelector, $headers;

                headerSelector = $(element).accordion('option', 'header');
                $headers = $(element).find(headerSelector);
                value.active($headers.index(ui.newHeader));
            });
            /*jslint unparam:false*/
        }

        //handle disposal
        ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
            $(element).off('ko');
        });
    };

    ko.jqueryui.bindingFactory.create({
        name: 'accordion',
        options: ['active', 'animate', 'collapsible', 'disabled', 'event', 'header',
            'heightStyle', 'icons'],
        events: ['activate', 'beforeActivate', 'create'],
        postInit: postInit,
        hasRefresh: true
    });
} ());