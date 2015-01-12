/*global define*/
define(

    [
        'jquery',
        'knockout',
        './bindingHandler',
        './utils',
        'jquery-ui/selectmenu'
    ],

    function ($, ko, BindingHandler, utils) {

        'use strict';

        var domDataKey, Selectmenu;

        domDataKey = '__kojqui_selectmenu_value';

        Selectmenu = function () {
            /// <summary>Constructor.</summary>

            BindingHandler.call(this, 'selectmenu');

            this.after = ['value'];
            this.options = ['appendTo', 'disabled', 'icons', 'position', 'width'];
            this.events = ['change', 'close', 'create', 'focus', 'open', 'select'];
            this.hasRefresh = true;
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
);
