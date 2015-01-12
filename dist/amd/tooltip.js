/*global define*/
define(

    [
        'jquery',
        'knockout',
        './bindingHandler',
        './utils',
        'jquery-ui/tooltip'
    ],

    function ($, ko, BindingHandler, utils) {

        'use strict';

        var Tooltip = function () {
            /// <summary>Constructor.</summary>

            BindingHandler.call(this, 'tooltip');

            this.options = ['content', 'disabled', 'hide', 'items', 'position', 'show',
                'tooltipClass', 'track'];
            this.events = ['create', 'open', 'close'];
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
);
