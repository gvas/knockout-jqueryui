/*global $, ko, versions, bindingFactory*/
/*jslint maxlen:256*/
(function () {
    'use strict';

    var postInitHandler, options, events, hasRefresh, postInit;

    postInitHandler = function (element, valueAccessor) {
        /// <summary>Keeps the active binding property in sync with the tabs' state.</summary>
        /// <param name='element' type='DOMNode'></param>
        /// <param name='valueAccessor' type='Function'></param>

        var value = valueAccessor();

        if (ko.isWriteableObservable(value.active)) {
            /*jslint unparam:true*/
            $(element).on('tabsactivate.ko', function (ev, ui) {
                value.active(ui.newTab.index());
            });
            /*jslint unparam:false*/
        }

        //handle disposal
        ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
            $(element).off('.ko');
        });
    };

    /*jslint white:true*/
    switch (versions.jQueryUI) {
        case '1.8':
            options = ['ajaxOptions', 'cache', 'collapsible', 'cookie', 'disabled',
                'event', 'fx', 'idPrefix', 'panelTemplate', 'selected', 'spinner',
                'tabTemplate'];
            events = ['add', 'create', 'disable', 'enable', 'load', 'remove', 'select',
                'show'];
            hasRefresh = false;
            break;
        case '1.9':
        case '1.10':
            options = ['active', 'collapsible', 'disabled', 'event', 'heightStyle', 'hide',
                'show'];
            events = ['activate', 'beforeActivate', 'beforeLoad', 'create', 'load'];
            postInit = postInitHandler;
            hasRefresh = true;
            break;
    }
    /*jslint white:false*/

    bindingFactory.create({
        name: 'tabs',
        options: options,
        events: events,
        postInit: postInit,
        hasRefresh: hasRefresh
    });
}());