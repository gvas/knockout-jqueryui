/*global define*/
define(

    [
        'jquery',
        'knockout',
        './utils',
        './bindingHandler',
        'jquery-ui/accordion'
    ],

    function ($, ko, utils, BindingHandler, accordion) {

        'use strict';

        var Accordion = function () {
            /// <summary>Constructor.</summary>

            var version = utils.parseVersionString(accordion.version);

            BindingHandler.call(this, 'accordion');

            if (version.major === 1 && version.minor === 8) {
                this.options = ['active', 'animated', 'autoHeight', 'clearStyle',
                    'collapsible', 'disabled', 'event', 'fillSpace', 'header', 'icons',
                    'navigation', 'navigationFilter'];
                this.events = ['change', 'changestart', 'create'];
                this.hasRefresh = false;
                this.eventToWatch = 'accordionchange.accordion';
            } else {
                this.options = ['active', 'animate', 'collapsible', 'disabled', 'event',
                    'header', 'heightStyle', 'icons'];
                this.events = ['activate', 'beforeActivate', 'create'];
                this.hasRefresh = true;
                this.eventToWatch = 'accordionactivate.accordion';
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

            var value = valueAccessor();

            BindingHandler.prototype.init.apply(this, arguments);

            if (ko.isWriteableObservable(value.active)) {
                $(element).on(this.eventToWatch, function () {
                    value.active($(element).accordion('option', 'active'));
                });
            }

            // handle disposal
            ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
                $(element).off('.accordion');
            });

            // the inner elements have already been taken care of
            return { controlsDescendantBindings: true };
        };

        utils.register(Accordion);

        return Accordion;
    }
);
