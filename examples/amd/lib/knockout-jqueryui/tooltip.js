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

            var value = valueAccessor();

            BindingHandler.prototype.init.apply(this, arguments);

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
                $(element).on('tooltipopen.tooltip', function () {
                    value.isOpen(true);
                });
                $(element).on('tooltipclose.tooltip', function () {
                    value.isOpen(false);
                });
            }

            // handle disposal
            ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
                $(element).off('.tooltip');
            });

            // the inner elements have already been taken care of
            return { controlsDescendantBindings: true };
        };

        utils.register(Tooltip);

        return Tooltip;
    }
);
