/*! knockout-jqueryui - v2.2.6 - 4/6/2017
* https://gvas.github.io/knockout-jqueryui/
* Copyright (c) 2017 Vas Gabor <gvas.munka@gmail.com> Licensed MIT */
/*jslint browser:true*/
/*globals global, self, window, require, module, define*/

(function (factory, global) {
    'use strict';

    // Module systems magic dance.
    if (typeof require === 'function' && typeof exports === 'object' && typeof module === 'object') {
        // CommonJS or Node: hard-coded dependency on 'knockout'
        module.exports = factory(require('jquery'), require('knockout'), require('jquery-ui'));
    } else if (typeof define === 'function' && define.amd) {
        // AMD anonymous module with hard-coded dependency on 'knockout'
        define(['jquery', 'knockout', 'jquery-ui', 'exports'], factory);
    } else {
        // <script> tag: use the global `ko` object
        global.kojqui = factory(jQuery, ko, jQuery.ui);
    }
}(function (jQuery, ko) {
    'use strict';

    var kojqui = { version: '2.2.6' };

    (function (factory) {

        kojqui.utils = factory(jQuery, ko, jQuery.ui.core);
    }(function ($, ko) {

        var match, uiVersion, descendantControllingBindings, createObject, register;

        /*jslint regexp:true*/
        match = ($.ui.version || '').match(/^(\d)\.(\d+)/);
        /*jslint regexp:false*/

        if (!match) {
            uiVersion = null;
        } else {
            uiVersion = {
                major: parseInt(match[1], 10),
                minor: parseInt(match[2], 10)
            };
        }

        descendantControllingBindings = ['foreach', 'if', 'ifnot', 'with', 'html', 'text',
            'options'];

        createObject = Object.create || function (prototype) {
            /// <summary>Simple (incomplete) shim for Object.create().</summary>
            /// <param name='prototype' type='Object' mayBeNull='true'></param>
            /// <returns type='Object'></returns>

            function Type() { }
            Type.prototype = prototype;
            return new Type();
        };

        register = function (Constructor) {
            /// <summary>Registers a binding.</summary>
            /// <param name='Constructor' type='BindingHandler'>The binding handler's
            /// constructor function.</param>

            var handler = new Constructor();

            ko.bindingHandlers[handler.widgetName] = {
                after: ko.utils.arrayGetDistinctValues(
                    descendantControllingBindings.concat(handler.after || [])
                ),
                init: handler.init.bind(handler),
                update: handler.update.bind(handler)
            };
        };

        return {
            uiVersion: uiVersion,
            descendantControllingBindings: descendantControllingBindings,
            createObject: createObject,
            register: register
        };
    }
));
    (function (factory) {

        kojqui.BindingHandler = factory(jQuery, ko, kojqui.utils, jQuery.ui.widget);
    }(function ($, ko, utils) {

        var domDataKey, filterAndUnwrapProperties, subscribeToRefreshOn, BindingHandler;

        domDataKey = '__kojqui_options';

        filterAndUnwrapProperties = function (source, properties) {
            /// <summary>Filters and unwraps the properties of an object.</summary>
            /// <param name='source' type='Object'></param>
            /// <param name='properties' type='Array' elementType='String'></param>
            /// <returns type='Object'>A new object with the specified properties copied
            /// and unwrapped from source.</returns>

            var result = {};

            ko.utils.arrayForEach(properties, function (property) {
                if (source[property] !== undefined) {
                    result[property] = ko.utils.unwrapObservable(source[property]);
                }
            });

            return result;
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

        BindingHandler = function (widgetName) {
            /// <summary>Constructor.</summary>
            /// <param name='widgetName' type='String'>The jQuery UI widget's
            /// name.</param>

            this.widgetName = widgetName;
            this.widgetEventPrefix = widgetName;
            this.options = [];
            this.events = [];
            this.after = [];
            this.hasRefresh = false;
        };

        /*jslint unparam:true*/
        BindingHandler.prototype.init = function (element, valueAccessor,
            allBindingsAccessor, viewModel, bindingContext) {

            var widgetName, value, unwrappedOptions, unwrappedEvents,
                shouldApplyBindingsToDescendants;

            widgetName = this.widgetName;
            value = valueAccessor();
            unwrappedOptions = filterAndUnwrapProperties(value, this.options);
            unwrappedEvents = filterAndUnwrapProperties(value, this.events);

            // There can be control flow- or other bindings on some of the descendant
            // elements which affect the shape of the element-rooted DOM subtree. These
            // should be processed before instantiating the jQuery UI widget, because they
            // can add pages to the tabs widget, menu items to the menu widget, etc.
            shouldApplyBindingsToDescendants = !ko.utils.arrayFirst(
                utils.descendantControllingBindings,
                function (bindingName) {
                    return this.hasOwnProperty(bindingName);
                },
                allBindingsAccessor()
            );
            if (shouldApplyBindingsToDescendants) {
                // process descendant bindings
                ko.applyBindingsToDescendants(bindingContext, element);
            }

            // store the options' values so they can be checked for changes in the
            // update() method
            ko.utils.domData.set(element, domDataKey, unwrappedOptions);

            // bind the widget events to the viewmodel
            $.each(unwrappedEvents, function (key, value) {
                unwrappedEvents[key] = value.bind(viewModel);
            });

            // initialize the widget
            $(element)[widgetName](ko.utils.extend(unwrappedOptions, unwrappedEvents));

            if (this.hasRefresh) {
                subscribeToRefreshOn(widgetName, element, value);
            }

            // store the element in the widget observable
            if (ko.isWriteableObservable(value.widget)) {
                value.widget($(element));
            }

            // handle disposal
            ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
                if ($.data(element, widgetName)) {
                    $(element)[widgetName]('destroy');
                }
            });

            return { controlsDescendantBindings: shouldApplyBindingsToDescendants };
        };
        /*jslint unparam:false*/

        BindingHandler.prototype.update = function (element, valueAccessor) {

            var widgetName, value, oldOptions, newOptions;

            widgetName = this.widgetName;
            value = valueAccessor();
            oldOptions = ko.utils.domData.get(element, domDataKey);
            newOptions = filterAndUnwrapProperties(value, this.options);

            // set only the changed options
            $.each(newOptions, function (prop, val) {
                if (val !== oldOptions[prop]) {
                    $(element)[widgetName]('option', prop, newOptions[prop]);
                }
            });

            // store the options' values so they can be checked for changes in the next
            // update() method
            ko.utils.domData.set(element, domDataKey, newOptions);
        };

        BindingHandler.prototype.on = function (element, type, callback) {
            /// <summary>Attaches callback to a widget event.</summary>
            /// <param name='element' type='DOMElement'></param>
            /// <param name='type' type='String'></param>
            /// <param name='callback' type='Function'></param>

            var eventName;

            // the same algorithm as in widget._trigger()
            if (type === this.widgetEventPrefix) {
                eventName = type;
            } else {
                eventName = this.widgetEventPrefix + type;
            }
            eventName = [eventName.toLowerCase(), '.', this.widgetName].join('');

            $(element).on(eventName, callback);

            // handle disposal
            ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
                $(element).off(eventName);
            });
        };

        return BindingHandler;
    }
));
    (function (factory) {

        kojqui.Accordion = factory(jQuery, ko, kojqui.utils, kojqui.BindingHandler, jQuery.ui.accordion);
    }(function ($, ko, utils, BindingHandler) {

        var Accordion = function () {
            /// <summary>Constructor.</summary>

            BindingHandler.call(this, 'accordion');

            if (utils.uiVersion.major === 1 && utils.uiVersion.minor === 8) {
                this.options = ['active', 'animated', 'autoHeight', 'clearStyle',
                    'collapsible', 'disabled', 'event', 'fillSpace', 'header', 'icons',
                    'navigation', 'navigationFilter'];
                this.events = ['change', 'changestart', 'create'];
                this.hasRefresh = false;
                this.eventToWatch = 'change';
            } else if (utils.uiVersion.major === 1 && (utils.uiVersion.minor >= 9 && utils.uiVersion.minor <= 11)) {
                this.options = ['active', 'animate', 'collapsible', 'disabled', 'event',
                    'header', 'heightStyle', 'icons'];
                this.events = ['activate', 'beforeActivate', 'create'];
                this.hasRefresh = true;
                this.eventToWatch = 'activate';
            } else {
                this.options = ['active', 'animate', 'classes', 'collapsible', 'disabled',
                     'event', 'header', 'heightStyle', 'icons'];
                this.events = ['activate', 'beforeActivate', 'create'];
                this.hasRefresh = true;
                this.eventToWatch = 'activate';
            }
        };

        Accordion.prototype = utils.createObject(BindingHandler.prototype);
        Accordion.prototype.constructor = Accordion;

        Accordion.prototype.init = function (element, valueAccessor) {
            /// <summary>Keeps the active binding property in sync with the widget's
            /// state.</summary>
            /// <param name='element' type='DOMNode'></param>
            /// <param name='valueAccessor' type='Function'></param>
            /// <returns type='Object'></returns>

            var widgetName, value, result;

            widgetName = this.widgetName;
            value = valueAccessor();

            result = BindingHandler.prototype.init.apply(this, arguments);

            if (ko.isWriteableObservable(value.active)) {
                this.on(element, this.eventToWatch, function () {
                    value.active($(element)[widgetName]('option', 'active'));
                });
            }

            return result;
        };

        utils.register(Accordion);

        return Accordion;
    }
));
    (function (factory) {

        kojqui.Autocomplete = factory(kojqui.BindingHandler, kojqui.utils, jQuery.ui.autocomplete);
    }(function (BindingHandler, utils) {

        var Autocomplete = function () {
            /// <summary>Constructor.</summary>

            BindingHandler.call(this, 'autocomplete');

            this.options = ['appendTo', 'autoFocus', 'delay', 'disabled', 'minLength',
                'position', 'source'];
            this.events = ['change', 'close', 'create', 'focus', 'open', 'search',
                'select'];

            if (utils.uiVersion.major === 1 && (utils.uiVersion.minor >= 9 && utils.uiVersion.minor <= 11)) {
                this.events.push('response');
                this.options.push('messages');
            } else {
                this.events.push('response');
                this.options.push('messages');
                this.options.push('classes');
                
            }
        };

        Autocomplete.prototype = utils.createObject(BindingHandler.prototype);
        Autocomplete.prototype.constructor = Autocomplete;

        utils.register(Autocomplete);

        return Autocomplete;
    }
));
    (function (factory) {

        kojqui.Button = factory(kojqui.BindingHandler, kojqui.utils, jQuery.ui.button);
    }(function (BindingHandler, utils) {

        var Button = function () {
            /// <summary>Constructor.</summary>

            BindingHandler.call(this, 'button');

            this.options = ['disabled', 'label'];
            this.events = ['create'];
            if (utils.uiVersion.major === 1 && (utils.uiVersion.minor >= 8 && utils.uiVersion.minor <= 11)) {
                this.options.push('icons');
                this.options.push('text');
            } else {
                this.options.push('classes');
                this.options.push('icon');
                this.options.push('iconPosition');
                this.options.push('showLabel');
            }
            this.hasRefresh = true;
        };

        Button.prototype = utils.createObject(BindingHandler.prototype);
        Button.prototype.constructor = Button;

        utils.register(Button);

        return Button;
    }
));
    (function (factory) {

        kojqui.Buttonset = factory(kojqui.BindingHandler, kojqui.utils, jQuery.ui.button);
    }(function (BindingHandler, utils) {

        var Buttonset = function () {
            /// <summary>Constructor.</summary>

            BindingHandler.call(this, 'buttonset');

            this.options = ['items', 'disabled'];
            this.events = ['create'];
            this.hasRefresh = true;
        };

        Buttonset.prototype = utils.createObject(BindingHandler.prototype);
        Buttonset.prototype.constructor = Buttonset;

        utils.register(Buttonset);

        return Buttonset;
    }
));
    (function (factory) {

        kojqui.Checkboxradio = factory(kojqui.BindingHandler, kojqui.utils, jQuery.ui.checkboxradio);
    }(function (BindingHandler, utils) {

        var Checkboxradio = function () {
            /// <summary>Constructor.</summary>

            BindingHandler.call(this, 'checkboxradio');

            this.options = ['classes', 'disabled', 'icon', 'label'];
            this.events = ['create'];
            if (utils.uiVersion.major === 1 && (utils.uiVersion.minor >= 8 && utils.uiVersion.minor <= 11)) {
                this.options.push('icons');
                this.options.push('text');
            } else {
                this.options.push('classes');
                this.options.push('icon');
                this.options.push('iconPosition');
                this.options.push('showLabel');
            }
            this.hasRefresh = true;
        };

        Checkboxradio.prototype = utils.createObject(BindingHandler.prototype);
        Checkboxradio.prototype.constructor = Checkboxradio;

        utils.register(Checkboxradio);

        return Checkboxradio;
    }
));
    (function (factory) {

        kojqui.Controlgroup = factory(kojqui.BindingHandler, kojqui.utils, jQuery.ui.controlgroup);
    }(function (BindingHandler, utils) {

        var Controlgroup = function () {
            /// <summary>Constructor.</summary>

            BindingHandler.call(this, 'controlgroup');

            this.options = ['classes', 'direction', 'disabled', 'items', 'onlyVisible'];
            this.events = ['create'];
            this.hasRefresh = true;
        };

        Controlgroup.prototype = utils.createObject(BindingHandler.prototype);
        Controlgroup.prototype.constructor = Controlgroup;

        utils.register(Controlgroup);

        return Controlgroup;
    }
));
    (function (factory) {

        kojqui.CustomCombobox = factory(kojqui.BindingHandler, kojqui.utils, jQuery.ui.autocomplete, jQuery.ui.button, jQuery.ui.tooltip);
    }(function (BindingHandler, utils) {

        var CustomCombobox = function () {
            /// <summary>Constructor.</summary>

            BindingHandler.call(this, 'combobox');

            this.options = ['removeIfInvalid', 'buttonTooltip'];
            this.events = [];
        };

        CustomCombobox.prototype = utils.createObject(BindingHandler.prototype);
        CustomCombobox.prototype.constructor = CustomCombobox;

        utils.register(CustomCombobox);

        return CustomCombobox;
    }
));
    (function (factory) {

        kojqui.Datepicker = factory(jQuery, ko, kojqui.BindingHandler, kojqui.utils, jQuery.ui.datepicker);
    }(function ($, ko, BindingHandler, utils) {

        var Datepicker = function () {
            /// <summary>Constructor.</summary>

            BindingHandler.call(this, 'datepicker');

            this.options = ['altField', 'altFormat', 'appendText', 'autoSize',
                'buttonImage', 'buttonImageOnly', 'buttonText', 'calculateWeek',
                'changeMonth', 'changeYear', 'closeText', 'constrainInput', 'currentText',
                'dateFormat', 'dayNames', 'dayNamesMin', 'dayNamesShort', 'defaultDate',
                'duration', 'firstDay', 'gotoCurrent', 'hideIfNoPrevNext', 'isRTL',
                'maxDate', 'minDate', 'monthNames', 'monthNamesShort',
                'navigationAsDateFormat', 'nextText', 'numberOfMonths', 'prevText',
                'selectOtherMonths', 'shortYearCutoff', 'showAnim', 'showButtonPanel',
                'showCurrentAtPos', 'showMonthAfterYear', 'showOn', 'showOptions',
                'showOtherMonths', 'showWeek', 'stepMonths', 'weekHeader', 'yearRange',
                'yearSuffix', 'beforeShow', 'beforeShowDay', 'onChangeMonthYear',
                'onClose', 'onSelect'];
            this.hasRefresh = true;
        };

        Datepicker.prototype = utils.createObject(BindingHandler.prototype);
        Datepicker.prototype.constructor = Datepicker;

        Datepicker.prototype.init = function (element, valueAccessor) {
            /// <summary>Keeps the value binding property in sync with the widget's state.
            /// </summary>
            /// <param name='element' type='DOMNode'></param>
            /// <param name='valueAccessor' type='Function'></param>
            /// <returns type='Object'></returns>

            var result, widgetName, options, value, subscription, origOnSelect;

            result = BindingHandler.prototype.init.apply(this, arguments);

            widgetName = this.widgetName;
            options = valueAccessor();
            value = ko.utils.unwrapObservable(options.value);

            if (value) {
                $(element)[widgetName]('setDate', value);
            }

            if (ko.isObservable(options.value)) {
                subscription = options.value.subscribe(function (newValue) {
                    $(element)[widgetName]('setDate', newValue);
                });

                ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
                    subscription.dispose();
                });
            }

            if (ko.isWriteableObservable(options.value)) {
                origOnSelect = $(element)[widgetName]('option', 'onSelect');
                $(element)[widgetName]('option', 'onSelect', function (selectedText) {
                    var format, date;

                    format = $(element)[widgetName]('option', 'dateFormat');
                    date = $.datepicker.parseDate(format, selectedText);
                    options.value(date);

                    if (typeof origOnSelect === 'function') {
                        origOnSelect.apply(this, Array.prototype.slice.call(arguments));
                    }
                });
            }

            return result;
        };

        utils.register(Datepicker);

        return Datepicker;
    }
));
    (function (factory) {

        kojqui.Dialog = factory(jQuery, ko, kojqui.BindingHandler, kojqui.utils, jQuery.ui.dialog);
    }(function ($, ko, BindingHandler, utils) {

        var Dialog = function () {
            /// <summary>Constructor.</summary>

            BindingHandler.call(this, 'dialog');

            this.events = ['beforeClose', 'create', 'open', 'focus', 'dragStart',
                'drag', 'dragStop', 'resizeStart', 'resize', 'resizeStop', 'close'];
            this.options = ['autoOpen', 'buttons', 'closeOnEscape',
                'closeText', 'dialogClass', 'draggable', 'height',
                'maxHeight', 'maxWidth', 'minHeight', 'minWidth', 'modal', 'position',
                'resizable', 'show', 'title', 'width'];
            
            if (utils.uiVersion.major === 1 && utils.uiVersion.minor === 8) {
                this.options.push('disabled');
                this.options.push('stack');
                this.options.push('zIndex');
            } else if (utils.uiVersion.major === 1 && utils.uiVersion.minor === 9) {
                this.options.push('stack');
                this.options.push('zIndex');
                this.options.push('hide');
            } else if (utils.uiVersion.major === 1 && (utils.uiVersion.minor === 10 || utils.uiVersion.minor === 11)) {
                this.options.push('appendTo');
                this.options.push('hide');
            } else {
                this.options.push('appendTo');
                this.options.push('hide');
                this.options.push('classes');
            }
        };

        Dialog.prototype = utils.createObject(BindingHandler.prototype);
        Dialog.prototype.constructor = Dialog;

        Dialog.prototype.init = function (element, valueAccessor) {
            /// <summary>Creates a hidden div before the element. This helps in disposing
            /// the binding if the element is moved from its original location.
            /// Keeps the isOpen binding property in sync with the dialog's state.
            // </summary>
            /// <param name='element' type='DOMNode'></param>
            /// <param name='valueAccessor' type='Function'></param>
            /// <returns type='Object'></returns>

            var marker, result, value;

            /// sets up the correct disposal
            marker = document.createElement('DIV');
            marker.style.display = 'none';
            element.parentNode.insertBefore(marker, element);

            ko.utils.domNodeDisposal.addDisposeCallback(marker, function () {
                ko.removeNode(element);
            });

            /// invokes the prototype's init() method
            result = BindingHandler.prototype.init.apply(this, arguments);

            /// sets up handling of the isOpen option
            value = valueAccessor();

            if (value.isOpen) {
                ko.computed({
                    read: function () {
                        if (ko.utils.unwrapObservable(value.isOpen)) {
                            $(element)[this.widgetName]('open');
                        } else {
                            $(element)[this.widgetName]('close');
                        }
                    },
                    disposeWhenNodeIsRemoved: element,
                    owner: this
                });
            }
            if (ko.isWriteableObservable(value.isOpen)) {
                this.on(element, 'open', function () {
                    value.isOpen(true);
                });
                this.on(element, 'close', function () {
                    value.isOpen(false);
                });
            }

            // make the width option two-way
            if (ko.isWriteableObservable(value.width)) {
                /*jslint unparam:true*/
                this.on(element, 'resizestop', function (ev, ui) {
                    value.width(Math.round(ui.size.width));
                });
                /*jslint unparam:false*/
            }

            // make the height option two-way
            if (ko.isWriteableObservable(value.height)) {
                /*jslint unparam:true*/
                this.on(element, 'resizestop', function (ev, ui) {
                    value.height(Math.round(ui.size.height));
                });
                /*jslint unparam:false*/
            }

            return result;
        };

        utils.register(Dialog);

        return Dialog;
    }
));
    (function (factory) {

        kojqui.Menu = factory(kojqui.BindingHandler, kojqui.utils, jQuery.ui.menu);
    }(function (BindingHandler, utils) {

        var Menu = function () {
            /// <summary>Constructor.</summary>

            BindingHandler.call(this, 'menu');

            this.options = ['disabled', 'icons', 'menus', 'position', 'role'];
            if (utils.uiVersion.major === 1 && utils.uiVersion.minor === 11) {
                this.options.push('items');
            } else {
                this.options.push('items');
                this.options.push('classes');
            }

            this.events = ['blur', 'create', 'focus', 'select'];
            this.hasRefresh = true;
        };

        Menu.prototype = utils.createObject(BindingHandler.prototype);
        Menu.prototype.constructor = Menu;

        utils.register(Menu);

        return Menu;
    }
));
    (function (factory) {

        kojqui.Progressbar = factory(kojqui.BindingHandler, kojqui.utils, jQuery.ui.progressbar);
    }(function (BindingHandler, utils) {

        var Progressbar = function () {
            /// <summary>Constructor.</summary>

            BindingHandler.call(this, 'progressbar');

            this.options = ['disabled', 'value'];
            this.events = ['change', 'create', 'complete'];
            this.hasRefresh = true;

            if (utils.uiVersion.major === 1 && (utils.uiVersion.minor >= 9 && utils.uiVersion.minor <= 11)) {
                this.options.push('max');
            } else {
                this.options.push('max');
                this.options.push('classes');
            }
        };

        Progressbar.prototype = utils.createObject(BindingHandler.prototype);
        Progressbar.prototype.constructor = Progressbar;

        utils.register(Progressbar);

        return Progressbar;
    }
));
    (function (factory) {

        kojqui.Selectmenu = factory(jQuery, ko, kojqui.BindingHandler, kojqui.utils, jQuery.ui.selectmenu);
    }(function ($, ko, BindingHandler, utils) {

        var domDataKey, Selectmenu;

        domDataKey = '__kojqui_selectmenu_value';

        Selectmenu = function () {
            /// <summary>Constructor.</summary>

            BindingHandler.call(this, 'selectmenu');

            this.after = ['value'];
            this.options = ['appendTo', 'disabled', 'icons', 'position', 'width'];
            this.events = ['change', 'close', 'create', 'focus', 'open', 'select'];
            this.hasRefresh = true;
            
            if (utils.uiVersion.major !== 1 || utils.uiVersion.minor !== 11) {
                this.options.push('classes');
            }
        };

        Selectmenu.prototype = utils.createObject(BindingHandler.prototype);
        Selectmenu.prototype.constructor = Selectmenu;

        Selectmenu.prototype.init = function (element, valueAccessor) {
            /// <summary>Connects the view model and the widget via the isOpen property.
            // </summary>
            /// <param name='element' type='DOMNode'></param>
            /// <param name='valueAccessor' type='Function'></param>
            /// <returns type='Object'></returns>

            var value, result;

            value = valueAccessor();

            /// invokes the prototype's init() method
            result = BindingHandler.prototype.init.apply(this, arguments);

            // maintain the isOpen option
            if (value.hasOwnProperty('isOpen')) {
                ko.computed({
                    read: function () {
                        if (ko.utils.unwrapObservable(value.isOpen)) {
                            $(element)[this.widgetName]('open');
                        } else {
                            $(element)[this.widgetName]('close');
                        }
                    },
                    disposeWhenNodeIsRemoved: element,
                    owner: this
                });
            }
            if (ko.isWriteableObservable(value.isOpen)) {
                this.on(element, 'open', function () {
                    value.isOpen(true);
                });
                this.on(element, 'close', function () {
                    value.isOpen(false);
                });
            }

            // Notify knockout's value- and selectedOptions bindings that the selected
            // option has been changed.
            this.on(element, 'change', function () {
                $(element).trigger('change');
            });

            return result;
        };

        /*jslint unparam:true*/
        Selectmenu.prototype.update = function (element, valueAccessor,
            allBindingsAccessor) {
            /// <summary>Refreshes the widget if the value binding changes.</summary>
            /// <param name='element' type='DOMNode'></param>
            /// <param name='valueAccessor' type='Function'></param>
            /// <param name='allBindingsAccessor' type='Object'></param>

            var oldValue, newValue;

            BindingHandler.prototype.update.apply(this, arguments);

            // synchronize the selected option with knockout's standard value binding
            if (allBindingsAccessor().hasOwnProperty('value')) {
                oldValue = ko.utils.domData.get(element, domDataKey);
                newValue = ko.utils.unwrapObservable(allBindingsAccessor().value);
                if (oldValue !== newValue) {
                    $(element).selectmenu('refresh');
                }
            }
        };
        /*jslint unparam:false*/

        utils.register(Selectmenu);

        return Selectmenu;
    }
));
    (function (factory) {

        kojqui.Slider = factory(jQuery, ko, kojqui.BindingHandler, kojqui.utils, jQuery.ui.slider);
    }(function ($, ko, BindingHandler, utils) {

        var domDataKey, Slider;

        domDataKey = '__kojqui_options';

        Slider = function () {
            /// <summary>Constructor.</summary>

            BindingHandler.call(this, 'slider');

            this.widgetEventPrefix = 'slide';
            this.options = ['animate', 'disabled', 'max', 'min', 'orientation', 'range',
                'step', 'value', 'values'];
            this.events = ['create', 'start', 'slide', 'change', 'stop'];
            
            if (utils.uiVersion.major !== 1 || utils.uiVersion.minor > 11) {
                this.options.push('classes');
            }
        };

        Slider.prototype = utils.createObject(BindingHandler.prototype);
        Slider.prototype.constructor = Slider;

        Slider.prototype.init = function (element, valueAccessor) {
            /// <summary>Keeps the value and the values binding property in sync with the
            /// slider widget's values.</summary>
            /// <param name='element' type='DOMNode'></param>
            /// <param name='valueAccessor' type='Function'></param>

            var result, value, changeEvent;

            result = BindingHandler.prototype.init.apply(this, arguments);

            value = valueAccessor();
            changeEvent = value.realtime ? 'slide' : 'change';

            if (ko.isWriteableObservable(value.value)) {
                /*jslint unparam:true*/
                this.on(element, changeEvent, function (ev, ui) {
                    var index = $(element).find('.ui-slider-handle').index(ui.handle);
                    if (index === 0) {
                        // The slider widget, in its _slide() method, raises the
                        // slide/slidechange events, then immediately updates its value
                        // property. If any of the event handlers hooked onto the
                        // slide/slidechange event sets the widget's value property, it
                        // will ruin the sliding animation.
                        // To prevent that, we trick the update() method defined in
                        // BindingHandler to think that the value option is already
                        // updated.
                        ko.utils.domData.get(element, domDataKey).value = ui.value;
                        value.value(ui.value);
                    }
                });
                /*jslint unparam:false*/
            }
            if (ko.isWriteableObservable(value.values)) {
                /*jslint unparam:true*/
                this.on(element, changeEvent, function (ev, ui) {
                    // see the explanation above
                    ko.utils.domData.get(element, domDataKey).value = ui.values;
                    value.values(ui.values);
                });
                /*jslint unparam:false*/
            }

            return result;
        };

        utils.register(Slider);

        return Slider;
    }
));
    (function (factory) {

        kojqui.Spinner = factory(jQuery, ko, kojqui.BindingHandler, kojqui.utils, jQuery.ui.spinner);
    }(function ($, ko, BindingHandler, utils) {

        var Spinner = function () {
            /// <summary>Constructor.</summary>

            BindingHandler.call(this, 'spinner');

            this.widgetEventPrefix = 'spin';
            this.options = ['culture', 'disabled', 'icons', 'incremental', 'max', 'min',
                'numberFormat', 'page', 'step'];
            this.events = ['create', 'start', 'spin', 'stop', 'change'];
            
            if (utils.uiVersion.major !== 1 || utils.uiVersion.minor > 11) {
                this.options.push('classes');
            }
        };

        Spinner.prototype = utils.createObject(BindingHandler.prototype);
        Spinner.prototype.constructor = Spinner;

        Spinner.prototype.init = function (element, valueAccessor) {
            /// <summary>Keeps the value binding property in sync with the spinner's
            /// value.</summary>
            /// <param name='element' type='DOMNode'></param>
            /// <param name='valueAccessor' type='Function'></param>
            /// <param name='allBindingsAccessor' type='Function'></param>

            var result, widgetName, value;

            result = BindingHandler.prototype.init.apply(this, arguments);

            widgetName = this.widgetName;
            value = valueAccessor();

            if (value.value) {
                ko.computed({
                    read: function () {
                        $(element)[widgetName]('value',
                            ko.utils.unwrapObservable(value.value));
                    },
                    disposeWhenNodeIsRemoved: element
                });
            }

            if (ko.isWriteableObservable(value.value)) {
                // The spin event is raised immediately when the value is changed with the
                // up/down buttons, while the change event is raised when the value is set
                // via the widget's value() method. Let's listen to both events.

                /*jslint unparam:true*/
                this.on(element, 'spin', function (ev, ui) {
                    value.value(ui.value);
                });
                /*jslint unparam:false*/

                this.on(element, 'change', function () {
                    value.value($(element)[widgetName]('value'));
                });
            }

            return result;
        };

        utils.register(Spinner);

        return Spinner;
    }
));
    (function (factory) {

        kojqui.Tabs = factory(jQuery, ko, kojqui.BindingHandler, kojqui.utils, jQuery.ui.tabs);
    }(function ($, ko, BindingHandler, utils) {

        var postInitHandler18, postInitHandler, Tabs;

        postInitHandler18 = function (element, valueAccessor) {
            /// <summary>Keeps the active binding property in sync with the tabs' state.
            /// </summary>
            /// <param name='element' type='DOMNode'></param>
            /// <param name='valueAccessor' type='Function'></param>

            var value = valueAccessor();

            if (ko.isWriteableObservable(value.selected)) {
                /*jslint unparam:true*/
                this.on(element, 'show', function (ev, ui) {
                    if ($(element)[0] === ev.target) {
                        // Only activate if this is the right tab widget.
                        value.selected(ui.index);
                    }
                });
                /*jslint unparam:false*/
            }
        };

        postInitHandler = function (element, valueAccessor) {
            /// <summary>Keeps the active binding property in sync with the tabs' state.
            /// </summary>
            /// <param name='element' type='DOMNode'></param>
            /// <param name='valueAccessor' type='Function'></param>

            var value = valueAccessor();

            if (ko.isWriteableObservable(value.active)) {
                /*jslint unparam:true*/
                this.on(element, 'activate', function (ev, ui) {
                    if ($(element)[0] === ev.target) {
                        // Only activate if this is the right tab widget.
                        value.active(ui.newTab.index());
                    }
                });
                /*jslint unparam:false*/
            }
        };

        Tabs = function () {
            /// <summary>Constructor.</summary>

            BindingHandler.call(this, 'tabs');

            this.version = utils.uiVersion;

            if (this.version.major === 1 && this.version.minor === 8) {
                this.options = ['ajaxOptions', 'cache', 'collapsible', 'cookie',
                    'disabled', 'event', 'fx', 'idPrefix', 'panelTemplate', 'selected',
                    'spinner', 'tabTemplate'];
                this.events = ['add', 'create', 'disable', 'enable', 'load', 'remove',
                    'select', 'show'];
                this.hasRefresh = false;
            } else if (utils.uiVersion.major === 1 && (utils.uiVersion.minor >= 9 && utils.uiVersion.minor <= 11)) {
                this.options = ['active', 'collapsible', 'disabled', 'event',
                    'heightStyle', 'hide', 'show'];
                this.events = ['activate', 'beforeActivate', 'beforeLoad', 'create',
                    'load'];
                this.hasRefresh = true;
            } else {
                this.options = ['active', 'classes', 'collapsible', 'disabled', 'event',
                    'heightStyle', 'hide', 'show'];
                this.events = ['activate', 'beforeActivate', 'beforeLoad', 'create',
                    'load'];
                this.hasRefresh = true;
            }
        };

        Tabs.prototype = utils.createObject(BindingHandler.prototype);
        Tabs.prototype.constructor = Tabs;

        Tabs.prototype.init = function (element, valueAccessor) {
            /// <summary>Keeps the active binding property in sync with the tabs' state.
            /// </summary>
            /// <param name='element' type='DOMNode'></param>
            /// <param name='valueAccessor' type='Function'></param>

            var result = BindingHandler.prototype.init.apply(this, arguments);

            if (this.version.major === 1 && this.version.minor === 8) {
                postInitHandler18.call(this, element, valueAccessor);
            } else {
                postInitHandler.call(this, element, valueAccessor);
            }

            return result;
        };

        utils.register(Tabs);

        return Tabs;
    }
));
    (function (factory) {

        kojqui.Tooltip = factory(jQuery, ko, kojqui.BindingHandler, kojqui.utils, jQuery.ui.tooltip);
    }(function ($, ko, BindingHandler, utils) {

        var Tooltip = function () {
            /// <summary>Constructor.</summary>

            BindingHandler.call(this, 'tooltip');

            this.options = ['content', 'disabled', 'hide', 'items', 'position', 'show',
                'tooltipClass', 'track'];
            this.events = ['create', 'open', 'close'];

            if (utils.uiVersion.major !== 1 || utils.uiVersion.minor > 11) {
                this.options.push('classes');
            }
        };

        Tooltip.prototype = utils.createObject(BindingHandler.prototype);
        Tooltip.prototype.constructor = Tooltip;

        Tooltip.prototype.init = function (element, valueAccessor) {
            /// <summary>Keeps the isOpen binding property in sync with the tooltip's
            /// state.
            /// </summary>
            /// <param name='element' type='DOMNode'></param>
            /// <param name='valueAccessor' type='Function'></param>

            var value, result;

            value = valueAccessor();

            result = BindingHandler.prototype.init.apply(this, arguments);

            if (value.isOpen) {
                ko.computed({
                    read: function () {
                        if (ko.utils.unwrapObservable(value.isOpen)) {
                            $(element)[this.widgetName]('open');
                        } else {
                            $(element)[this.widgetName]('close');
                        }
                    },
                    disposeWhenNodeIsRemoved: element,
                    owner: this
                });
            }
            if (ko.isWriteableObservable(value.isOpen)) {
                this.on(element, 'open', function () {
                    value.isOpen(true);
                });
                this.on(element, 'close', function () {
                    value.isOpen(false);
                });
            }

            return result;
        };

        utils.register(Tooltip);

        return Tooltip;
    }
));

    return kojqui;
}, typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : typeof window !== 'undefined' ? window : {}));