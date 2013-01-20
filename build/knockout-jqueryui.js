/*! knockout-jqueryui - v0.1.0 - 1/20/2013
* https://github.com/gvas/knockout-jqueryui
* Copyright (c) 2013 Vas Gabor <gvas.munka@gmail.com>; Licensed MIT */
/*global ko,$*/
/*jslint browser:true maxlen:256*/

(function () {
    'use strict';

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

        var widgetName, flag, init;

        widgetName = options.name;
        flag = 'ko_' + widgetName + '_initialized';

        /*jslint unparam:true*/
        init = function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {

            var value, widgetOptions, widgetOptionsAndEvents;

            // prevent multiple inits
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
                    delete element[flag];
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
    };

    ko.jqueryui = ko.jqueryui || {};

    ko.jqueryui.bindingFactory = {
        create: create
    };
} ());
(function () {
    'use strict';

    ko.jqueryui.bindingFactory.create({
        name: 'button',
        options: ['disabled', 'icons', 'label', 'text'],
        events: ['create'],
        hasRefresh: true
    });
}());
(function () {
    'use strict';

    ko.jqueryui.bindingFactory.create({
        name: 'buttonset',
        options: ['items', 'disabled'],
        events: ['create'],
        hasRefresh: true
    });
}());
(function () {
    'use strict';

    var preInit, postInit;

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

        if (ko.isObservable(value.isOpen)) {
            ko.computed({
                read: function () {
                    if (value.isOpen()) {
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
            $(element).off('ko');
        });
    };

    ko.jqueryui.bindingFactory.create({
        name: 'dialog',
        options: ['autoOpen', 'buttons', 'closeOnEscape', 'closeText', 'dialogClass',
            'draggable', 'height', 'hide', 'maxHeight', 'maxWidth', 'minHeight',
            'minWidth', 'modal', 'position', 'resizable', 'show', 'stack', 'title',
            'width', 'zIndex'],
        events: ['beforeClose', 'create', 'open', 'focus', 'dragStart', 'drag',
            'dragStop', 'resizeStart', 'resize', 'resizeStop', 'close'],
        preInit: preInit,
        postInit: postInit
    });
}());
(function () {
    'use strict';

    ko.jqueryui.bindingFactory.create({
        name: 'menu',
        options: ['disabled', 'icons', 'menus', 'position', 'role'],
        events: ['blur', 'create', 'focus', 'select'],
        hasRefresh: true
    });
}());
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
            $(element).on('tabsactivate.ko', function (ev, ui) {
                value.active(ui.newTab.index());
            });
            /*jslint unparam:true*/
        }

        //handle disposal
        ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
            $(element).off('ko');
        });
    };

    ko.jqueryui.bindingFactory.create({
        name: 'tabs',
        options: ['active', 'collapsible', 'disabled', 'event', 'heightStyle', 'hide',
            'show'],
        events: ['activate', 'beforeActivate', 'beforeLoad', 'create', 'load'],
        postInit: postInit,
        hasRefresh: true
    });
}());