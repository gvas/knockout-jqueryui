/*global $, ko, versions, bindingFactory*/
/*jslint maxlen:256*/
(function () {
    'use strict';

    var postInitHandler18, postInitHandler, options, events, hasRefresh, postInit;

    postInitHandler18 = function (element, valueAccessor) {
        /// <summary>Keeps the active binding property in sync with the tabs' state.</summary>
        /// <param name='element' type='DOMNode'></param>
        /// <param name='valueAccessor' type='Function'></param>

        var value = valueAccessor();

        if (ko.isWriteableObservable(value.selected)) {
            /*jslint unparam:true*/
            $(element).on('tabsshow.tabs', function (ev, ui) {
                if ($(element)[0] === ev.target) {
                    // Only activate if this is the right tab widget.
                    value.selected(ui.index);
                }
            });
            /*jslint unparam:false*/
        }

        //handle disposal
        ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
            $(element).off('.tabs');
        });
    };

    postInitHandler = function (element, valueAccessor) {
        /// <summary>Keeps the active binding property in sync with the tabs' state.</summary>
        /// <param name='element' type='DOMNode'></param>
        /// <param name='valueAccessor' type='Function'></param>

        var value = valueAccessor();

        if (ko.isWriteableObservable(value.active)) {
            /*jslint unparam:true*/
            $(element).on('tabsactivate.tabs', function (ev, ui) {
                if ($(element)[0] === ev.target) {
                    // Only activate if this is the right tab widget.
                    value.active(ui.newTab.index());
                }
            });
            /*jslint unparam:false*/
        }

        //handle disposal
        ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
            $(element).off('.tabs');
        });
    };

    if (versions.jQueryUI.major === 1 && versions.jQueryUI.minor === 8) {
        options = ['ajaxOptions', 'cache', 'collapsible', 'cookie', 'disabled',
            'event', 'fx', 'idPrefix', 'panelTemplate', 'selected',
            'spinner', 'tabTemplate'];
        events = ['add', 'create', 'disable', 'enable', 'load', 'remove', 'select',
            'show'];
        postInit = postInitHandler18;
        hasRefresh = false;
    } else {
        options = ['active', 'collapsible', 'disabled', 'event', 'heightStyle', 'hide',
            'show'];
        events = ['activate', 'beforeActivate', 'beforeLoad', 'create', 'load'];
        postInit = postInitHandler;
        hasRefresh = true;
    }

    bindingFactory.create({
        name: 'tabs',
        options: options,
        events: events,
        postInit: postInit,
        hasRefresh: hasRefresh
    });
}());