/*global $, ko, versions, bindingFactory*/
/*jslint maxlen:256*/
(function () {
    'use strict';

    var postInitHandler18, postInitHandler19, options, events, hasRefresh, postInit;

    postInitHandler18 = function (element, valueAccessor) {
        /// <summary>Keeps the active binding property in sync with the tabs' state.</summary>
        /// <param name='element' type='DOMNode'></param>
        /// <param name='valueAccessor' type='Function'></param>

        var value = valueAccessor();

        if (ko.isWriteableObservable(value.active)) {
            /*jslint unparam:true*/
            $(element).on('tabsshow.ko', function (ev, ui) {
                value.selected(ui.index);
            });
            /*jslint unparam:false*/
        }

        //handle disposal
        ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
            $(element).off('.ko');
        });
    };

    postInitHandler19 = function (element, valueAccessor) {
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

    switch (versions.jQueryUI) {
    case '1.8':
        options = ['ajaxOptions', 'cache', 'collapsible', 'cookie', 'disable',
            'disabled', 'event', 'fx', 'idPrefix', 'panelTemplate', 'selected',
            'spinner', 'tabTemplate'];
        events = ['add', 'create', 'disable', 'enable', 'load', 'remove', 'select',
            'show'];
        postInit = postInitHandler18;
        hasRefresh = false;
        break;
    case '1.9':
    case '1.10':
        options = ['active', 'collapsible', 'disabled', 'event', 'heightStyle', 'hide',
            'show'];
        events = ['activate', 'beforeActivate', 'beforeLoad', 'create', 'load'];
        postInit = postInitHandler19;
        hasRefresh = true;
        break;
    }

    bindingFactory.create({
        name: 'tabs',
        options: options,
        events: events,
        postInit: postInit,
        hasRefresh: hasRefresh
    });
}());