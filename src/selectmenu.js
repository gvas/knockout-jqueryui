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

        var Selectmenu = function () {
            /// <summary>Constructor.</summary>

            BindingHandler.call(this, 'selectmenu');

            this.after = ['value'];
            this.options = ['appendTo', 'disabled', 'icons', 'position', 'width'];
            this.events = ['change', 'close', 'create', 'focus', 'open', 'select'];
            this.hasRefresh = true;
        };

        Selectmenu.prototype = utils.createObject(BindingHandler.prototype);
        Selectmenu.prototype.constructor = Selectmenu;

        Selectmenu.prototype.init = function (element, valueAccessor,
            allBindingsAccessor) {
            /// <summary>Connects the view model and the widget via the isOpen property.
            // </summary>
            /// <param name='element' type='DOMNode'></param>
            /// <param name='valueAccessor' type='Function'></param>
            /// <param name='allBindingsAccessor' type='Object'></param>
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

            // synchronize the selected option with knockout's standard value binding
            if (allBindingsAccessor().hasOwnProperty('value')) {
                ko.computed({
                    read: function () {
                        ko.utils.unwrapObservable(allBindingsAccessor().value);
                        $(element).selectmenu('refresh');
                    },
                    disposeWhenNodeIsRemoved: element
                });
            }

            // Notify knockout's value- and selectedOptions bindings that the selected
            // option has been changed.
            this.on(element, 'change', function () {
                $(element).trigger('change');
            });

            return result;
        };

        utils.register(Selectmenu);

        return Selectmenu;
    }
);
