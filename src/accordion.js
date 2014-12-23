/*global define*/
define(

    [
        'jquery',
        'knockout',
        './utils',
        './bindingHandler',
        'jquery-ui/accordion'
    ],

    function ($, ko, utils, BindingHandler) {

        'use strict';

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
            } else {
                this.options = ['active', 'animate', 'collapsible', 'disabled', 'event',
                    'header', 'heightStyle', 'icons'];
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
);
