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

            var value = valueAccessor();

            /// invokes the prototype's init() method
            BindingHandler.prototype.init.apply(this, arguments);

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

            // the inner elements have already been taken care of
            return { controlsDescendantBindings: true };
        };

        utils.register(Selectmenu);

        return Selectmenu;
    }
);
