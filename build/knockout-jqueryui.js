/*! knockout-jqueryui - v0.3.0 - 5/24/2013
* https://github.com/gvas/knockout-jqueryui
* Copyright (c) 2013 Vas Gabor <gvas.munka@gmail.com>; Licensed MIT */


/*global require, define, exports*/
/*jslint browser:true maxlen:256*/
(function (root, factory) {
    'use strict';

    if (typeof exports === 'object') {
        // CommonJS
        factory(exports, require('jquery'), require('knockout'), require('jquery-ui'));
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['exports', 'jquery', 'knockout', 'jquery-ui'], factory);
    } else {
        // Browser globals
        factory((root.kojqui = {}), root.jQuery, root.ko);
    }
} (this, function (exports, $, ko) {
    'use strict';

    var versions, bindingFactory;

    versions = (function () {
        
    
        var getMajorMinorVersion, jQuery, jQueryUI, knockout;
    
        getMajorMinorVersion = function (version) {
            /// <summary>Returns the major.minor version from the version string.</summary>
            /// <param name='version' type='String'></param>
            /// <returns type='String'></returns>
    
            var match = (version || '').match(/^(\d\.\d+)\.\d+$/);
    
            return match ? match[1] : null;
        };
    
        jQuery = $ && $.fn ? getMajorMinorVersion($.fn.jquery) : null;
        jQueryUI = $ && $.ui ? getMajorMinorVersion($.ui.version) : null;
        knockout = ko ? getMajorMinorVersion(ko.version) : null;
    
        return {
            jQuery: jQuery,
            jQueryUI: jQueryUI,
            knockout: knockout
        };
    }());

    (function () {
        
    
        // dependency checks
        if (!versions.jQuery) {
            throw new Error('jQuery must be loaded before knockout-jquery.');
        }
        if (!versions.jQueryUI) {
            throw new Error('jQuery UI must be loaded before knockout-jquery.');
        }
        if (!versions.knockout) {
            throw new Error('knockout must be loaded before knockout-jquery.');
        }
    
        if (versions.jQueryUI !== '1.8' && versions.jQueryUI !== '1.9' && versions.jQueryUI !== '1.10') {
            throw new Error('This version of the jQuery UI library is not supported.');
        }
    
        if (versions.knockout !== '2.2') {
            throw new Error('This version of the knockout library is not supported.');
        }
    }());

    bindingFactory = (function () {
        
    
        var filterProperties, unwrapProperties, setOption, subscribeToObservableOptions, subscribeToRefreshOn,
            create;
    
        filterProperties = function (source, properties) {
            /// <summary>Filters the properties of an object.</summary>
            /// <param name='source' type='Object'></param>
            /// <param name='properties' type='Array' elementType='String'></param>
            /// <returns type='Object'>A new object with the specified properties copied from source.</returns>
    
            var result = {};
    
            ko.utils.arrayForEach(properties, function (property) {
                if (source[property] !== undefined) {
                    result[property] = source[property];
                }
            });
    
            return result;
        };
    
        unwrapProperties = function (obj) {
            /// <summary>Returns a new object with obj's unwrapped properties.</summary>
            /// <param name='obj' type='Object'></param>
            /// <returns type='Object'></returns>
    
            var result, prop;
    
            result = {};
    
            for (prop in obj) {
                if (obj.hasOwnProperty(prop)) {
                    if (ko.isObservable(obj[prop])) {
                        result[prop] = obj[prop].peek();
                    } else {
                        result[prop] = obj[prop];
                    }
                }
            }
    
            return result;
        };
    
        setOption = function (widgetName, element, optionName, observableOrValue) {
            /// <summary>Sets an option on the widget.</summary>
            /// <param name='widgetName' type='String'>The widget's name.</param>
            /// <param name='element' type='DOMNode'></param>
            /// <param name='optionName' type='String'>The option to set.</param>
            /// <param name='observableOrValue'>The option's value or an observable containing the value.</param>
    
            $(element)[widgetName]('option', optionName, ko.utils.unwrapObservable(observableOrValue));
        };
    
        subscribeToObservableOptions = function (widgetName, element, options) {
            /// <summary>Creates a subscription to each observable option.</summary>
            /// <param name='widgetName' type='String'>The widget's name.</param>
            /// <param name='element' type='DOMNode'></param>
            /// <param name='options' type='Array'></param>
    
            var prop;
    
            for (prop in options) {
                if (options.hasOwnProperty(prop) && ko.isObservable(options[prop])) {
                    ko.computed({
                        // moved to a separate function to make jslint happy
                        read: setOption.bind(this, widgetName, element, prop, options[prop]),
                        disposeWhenNodeIsRemoved: element
                    });
                }
            }
        };
    
        subscribeToRefreshOn = function (widgetName, element, bindingValue) {
            /// <summary>Creates a subscription to the refreshOn observable.</summary>
            /// <param name='widgetName' type='String'>The widget's name.</param>
            /// <param name='element' type='DOMNode'></param>
            /// <param name='bindingValue' type='Object'></param>
    
            if (ko.isObservable(bindingValue.refreshOn)) {
                ko.computed({
                    read: function () {
                        bindingValue.refreshOn();
                        $(element)[widgetName]('refresh');
                    },
                    disposeWhenNodeIsRemoved: element
                });
            }
        };
    
        create = function (options) {
            /// <summary>Creates a new binding.</summary>
            /// <param name='options' type='Object'></param>
    
            var widgetName, init;
    
            widgetName = options.name;
    
            // skip missing widgets
            if ($.fn[widgetName]) {
                /*jslint unparam:true*/
                init = function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
    
                    var flag, value, widgetOptions, widgetOptionsAndEvents;
    
                    // prevent multiple inits
                    flag = 'ko_' + widgetName + '_initialized';
                    if (!element[flag]) {
    
                        value = valueAccessor();
                        widgetOptions = filterProperties(value, options.options);
                        widgetOptionsAndEvents = filterProperties(value, options.options.concat(options.events));
    
                        // execute the provided callback before the widget initialization
                        if (options.preInit) {
                            options.preInit.apply(this, arguments);
                        }
    
                        // allow inner elements' bindings to finish before initializing the widget
                        ko.applyBindingsToDescendants(bindingContext, element);
    
                        // initialize the widget
                        $(element)[widgetName](unwrapProperties(widgetOptionsAndEvents));
    
                        subscribeToObservableOptions(widgetName, element, widgetOptions);
    
                        if (options.hasRefresh) {
                            subscribeToRefreshOn(widgetName, element, value);
                        }
    
                        // store the widget instance in the widget observable
                        if (ko.isWriteableObservable(value.widget)) {
                            value.widget($(element)[widgetName]('widget'));
                        }
    
                        // handle disposal
                        ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
                            $(element)[widgetName]('destroy');
                            element[flag] = null;
                        });
    
                        // execute the provided callback after the widget initialization
                        if (options.postInit) {
                            options.postInit.apply(this, arguments);
                        }
    
                        element[flag] = true;
                    }
    
                    // the inner elements have already been taken care of
                    return { controlsDescendantBindings: true };
                };
                /*jslint unparam:false*/
    
                ko.bindingHandlers[widgetName] = {
                    init: init
                };
            }
        };
    
        return {
            create: create
        };
    }());

    (function () {
        
    
        var postInit, options, events, hasRefresh;
    
        postInit = function (element, valueAccessor) {
            /// <summary>Keeps the active binding property in sync with the tabs' state.
            /// </summary>
            /// <param name='element' type='DOMNode'></param>
            /// <param name='valueAccessor' type='Function'></param>
    
            var value = valueAccessor();
    
            if (ko.isWriteableObservable(value.active)) {
                $(element).on('accordionactivate.ko', function () {
                    value.active($(element).accordion('option', 'active'));
                });
            }
    
            //handle disposal
            ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
                $(element).off('.ko');
            });
        };
    
        /*jslint white:true*/
        switch (versions.jQueryUI) {
            case '1.8':
                options = ['active', 'animated', 'autoHeight', 'clearStyle', 'collapsible',
                    'disabled', 'event', 'fillSpace', 'header', 'icons', 'navigation',
                    'navigationFilter'];
                events = ['change', 'changestart', 'create'];
                hasRefresh = false;
                break;
            case '1.9':
            case '1.10':
                options = ['active', 'animate', 'collapsible', 'disabled', 'event', 'header',
                'heightStyle', 'icons'];
                events = ['activate', 'beforeActivate', 'create'];
                hasRefresh = true;
                break;
        }
        /*jslint white:false*/
    
        bindingFactory.create({
            name: 'accordion',
            options: options,
            events: events,
            postInit: postInit,
            hasRefresh: hasRefresh
        });
    }());

    (function () {
        
    
        var events;
    
        /*jslint white:true*/
        switch (versions.jQueryUI) {
            case '1.8':
                events = ['change', 'close', 'create', 'focus', 'open', 'search', 'select'];
                break;
            case '1.9':
            case '1.10':
                events = ['change', 'close', 'create', 'focus', 'open', 'response', 'search',
                'select'];
                break;
        }
        /*jslint white:false*/
    
        bindingFactory.create({
            name: 'autocomplete',
            options: ['appendTo', 'autoFocus', 'delay', 'disabled', 'minLength', 'position',
                'source'],
            events: events
        });
    }());

    (function () {
        
    
        bindingFactory.create({
            name: 'button',
            options: ['disabled', 'icons', 'label', 'text'],
            events: ['create'],
            hasRefresh: true
        });
    }());

    (function () {
        
    
        bindingFactory.create({
            name: 'buttonset',
            options: ['items', 'disabled'],
            events: ['create'],
            hasRefresh: true
        });
    }());

    (function () {
        
    
        bindingFactory.create({
            name: 'datepicker',
            options: ['altField', 'altFormat', 'appendText', 'autoSize', 'buttonImage',
                'buttonImageOnly', 'buttonText', 'calculateWeek', 'changeMonth', 'changeYear',
                'closeText', 'constrainInput', 'currentText', 'dateFormat', 'dayNames',
                'dayNamesMin', 'dayNamesShort', 'defaultDate', 'duration', 'firstDay',
                'gotoCurrent', 'hideIfNoPrevNext', 'isRTL', 'maxDate', 'minDate',
                'monthNames', 'monthNamesShort', 'navigationAsDateFormat', 'nextText',
                'numberOfMonths', 'prevText', 'selectOtherMonths', 'shortYearCutoff',
                'showAnim', 'showButtonPanel', 'showCurrentAtPos', 'showMonthAfterYear',
                'showOn', 'showOptions', 'showOtherMonths', 'showWeek', 'stepMonths',
                'weekHeader', 'yearRange', 'yearSuffix', 'beforeShow', 'beforeShowDay',
                'onChangeMonthYear', 'onClose', 'onSelect'],
            events: []
        });
    }());

    (function () {
        
    
        var preInit, postInit, options, events;
    
        preInit = function (element) {
            /// <summary>Creates a hidden div before the element. This helps in disposing the
            /// binding if the element is moved from its original location.</summary>
            /// <param name='element' type='DOMNode'></param>
    
            var marker;
    
            marker = document.createElement('DIV');
            marker.style.display = 'none';
            element.parentNode.insertBefore(marker, element);
    
            ko.utils.domNodeDisposal.addDisposeCallback(marker, function () {
                ko.removeNode(element);
            });
        };
    
        postInit = function (element, valueAccessor) {
            /// <summary>Keeps the isOpen binding property in sync with the dialog's state.
            /// </summary>
            /// <param name='element' type='DOMNode'></param>
            /// <param name='valueAccessor' type='Function'></param>
    
            var value = valueAccessor();
    
            if (value.isOpen) {
                ko.computed({
                    read: function () {
                        if (ko.utils.unwrapObservable(value.isOpen)) {
                            $(element).dialog('open');
                        } else {
                            $(element).dialog('close');
                        }
                    },
                    disposeWhenNodeIsRemoved: element
                });
            }
            if (ko.isWriteableObservable(value.isOpen)) {
                $(element).on('dialogopen.ko', function () {
                    value.isOpen(true);
                });
                $(element).on('dialogclose.ko', function () {
                    value.isOpen(false);
                });
            }
    
            //handle disposal
            ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
                $(element).off('.ko');
            });
        };
    
        /*jslint white:true*/
        switch (versions.jQueryUI) {
            case '1.8':
                options = ['autoOpen', 'buttons', 'closeOnEscape', 'closeText', 'dialogClass',
                    'disabled', 'draggable', 'height', 'maxHeight', 'maxWidth', 'minHeight',
                    'minWidth', 'modal', 'position', 'resizable', 'show', 'stack', 'title',
                    'width', 'zIndex'];
                events = ['beforeClose', 'create', 'open', 'focus', 'dragStart', 'drag',
                    'dragStop', 'resizeStart', 'resize', 'resizeStop', 'close'];
                break;
            case '1.9':
                options = ['autoOpen', 'buttons', 'closeOnEscape', 'closeText', 'dialogClass',
                    'draggable', 'height', 'hide', 'maxHeight', 'maxWidth', 'minHeight',
                    'minWidth', 'modal', 'position', 'resizable', 'show', 'stack', 'title',
                    'width', 'zIndex'];
                events = ['beforeClose', 'create', 'open', 'focus', 'dragStart', 'drag',
                    'dragStop', 'resizeStart', 'resize', 'resizeStop', 'close'];
                break;
            case '1.10':
                options = ['appendTo', 'autoOpen', 'buttons', 'closeOnEscape', 'closeText',
                    'dialogClass', 'draggable', 'height', 'hide', 'maxHeight', 'maxWidth',
                    'minHeight', 'minWidth', 'modal', 'position', 'resizable', 'show',
                    'title', 'width'];
                events = ['beforeClose', 'create', 'open', 'focus', 'dragStart', 'drag',
                    'dragStop', 'resizeStart', 'resize', 'resizeStop', 'close'];
                break;
        }
        /*jslint white:false*/
    
        bindingFactory.create({
            name: 'dialog',
            options: options,
            events: events,
            preInit: preInit,
            postInit: postInit
        });
    }());

    (function () {
        
    
        bindingFactory.create({
            name: 'menu',
            options: ['disabled', 'icons', 'menus', 'position', 'role'],
            events: ['blur', 'create', 'focus', 'select'],
            hasRefresh: true
        });
    }());

    (function () {
        
    
        var options;
    
        /*jslint white:true*/
        switch (versions.jQueryUI) {
            case '1.8':
                options = ['disabled', 'value'];
                break;
            case '1.9':
            case '1.10':
                options = ['disabled', 'max', 'value'];
                break;
        }
        /*jslint white:false*/
    
        bindingFactory.create({
            name: 'progressbar',
            options: options,
            events: ['change', 'create', 'complete']
        });
    }());

    (function () {
        
    
        var postInit;
    
        postInit = function (element, valueAccessor) {
            /// <summary>Keeps the value and the values binding property in sync with the
            /// slider widget's values.</summary>
            /// <param name='element' type='DOMNode'></param>
            /// <param name='valueAccessor' type='Function'></param>
    
            var value = valueAccessor();
    
            if (ko.isWriteableObservable(value.value)) {
                /*jslint unparam:true*/
                $(element).on('slidechange.ko', function (ev, ui) {
                    var $handles = $(element).find('.ui-slider-handle');
                    if ($handles[0] === ui.handle) {
                        value.value(ui.value);
                    }
                });
                /*jslint unparam:false*/
            }
    
            //handle disposal
            ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
                $(element).off('.ko');
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

    (function () {
        
    
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
                $(element).off('.ko');
            });
        };
    
        bindingFactory.create({
            name: 'spinner',
            options: ['culture', 'disabled', 'icons', 'incremental', 'max', 'min',
                'numberFormat', 'page', 'step'],
            events: ['create', 'start', 'spin', 'stop', 'change'],
            postInit: postInit
        });
    } ());

    (function () {
        
    
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

    (function () {
        
    
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
                $(element).on('tooltipopen.ko', function () {
                    value.isOpen(true);
                });
                $(element).on('tooltipclose.ko', function () {
                    value.isOpen(false);
                });
            }
    
            //handle disposal
            ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
                $(element).off('.ko');
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
    // make the binding factory accessible for the tests
    ko.jqui = {
        bindingFactory: bindingFactory
    };
    exports.version = '0.3.0';
}));