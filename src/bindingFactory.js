/*global bindingFactory:true, ko, $*/
/*jslint maxlen:256*/
bindingFactory = (function () {
    'use strict';

    var domDataKey, filterAndUnwrapProperties, subscribeToRefreshOn, create;

    domDataKey = '__kojqui_options';

    filterAndUnwrapProperties = function (source, properties) {
        /// <summary>Filters and unwraps the properties of an object.</summary>
        /// <param name='source' type='Object'></param>
        /// <param name='properties' type='Array' elementType='String'></param>
        /// <returns type='Object'>A new object with the specified properties copied and
        /// unwrapped from source.</returns>

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

    create = function (config) {
        /// <summary>Creates a new binding.</summary>
        /// <param name='config' type='Object'></param>

        var widgetName, init, update;

        widgetName = config.name;

        // skip missing widgets
        if (!$.fn[widgetName]) {
            return;
        }

        /*jslint unparam:true*/
        init = function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {

            var value, args, unwrappedOptions, unwrappedEvents;

            value = valueAccessor();
            unwrappedOptions = filterAndUnwrapProperties(value, config.options);
            unwrappedEvents = filterAndUnwrapProperties(value, config.events);
            args = arguments;

            // execute the preInit handlers
            ko.utils.arrayForEach(ko.bindingHandlers[widgetName].preInitHandlers, function (handler) {
                handler.apply(this, args);
            });

            // allow inner elements' bindings to finish before initializing the widget
            ko.applyBindingsToDescendants(bindingContext, element);

            // store the options' values so they can be checked for changes in the
            // update() method
            ko.utils.domData.set(element, domDataKey, unwrappedOptions);

            // bind the widget events to the viewmodel
            $.each(unwrappedEvents, function (key, value) {
                unwrappedEvents[key] = value.bind(viewModel);
            });

            // initialize the widget
            $(element)[widgetName](ko.utils.extend(unwrappedOptions, unwrappedEvents));

            if (config.hasRefresh) {
                subscribeToRefreshOn(widgetName, element, value);
            }

            // store the element in the widget observable
            if (ko.isWriteableObservable(value.widget)) {
                value.widget($(element));
            }

            // handle disposal
            ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
                $(element)[widgetName]('destroy');
            });

            // execute the postInit handlers
            ko.utils.arrayForEach(ko.bindingHandlers[widgetName].postInitHandlers, function (handler) {
                handler.apply(this, args);
            });

            // the inner elements have already been taken care of
            return { controlsDescendantBindings: true };
        };
        /*jslint unparam:false*/

        update = function (element, valueAccessor) {

            var value, oldOptions, newOptions;

            value = valueAccessor();
            oldOptions = ko.utils.domData.get(element, domDataKey);
            newOptions = filterAndUnwrapProperties(value, config.options);

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

        ko.bindingHandlers[widgetName] = {
            init: init,
            update: update,
            config: config,
            // let's keep the pre- and postInitHandlers for backward compatibility
            preInitHandlers: [],
            postInitHandlers: []
        };

        if (config.preInit) {
            ko.bindingHandlers[widgetName].preInitHandlers.push(config.preInit);
        }

        if (config.postInit) {
            ko.bindingHandlers[widgetName].postInitHandlers.push(config.postInit);
        }
    };

    return {
        create: create
    };
}());