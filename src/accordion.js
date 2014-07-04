/*global $, ko, exports*/
(function () {

    'use strict';

    var Accordion = function () {
        /// <summary>Constructor.</summary>

        exports.BindingHandler.call(this, 'accordion');

        if (exports.utils.versions.jQueryUI.major === 1 &&
                exports.utils.versions.jQueryUI.minor === 8) {
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

    Accordion.prototype = exports.utils.createObject(exports.BindingHandler.prototype);
    Accordion.prototype.constructor = Accordion;

    Accordion.prototype.init = function (element, valueAccessor) {
        /// <summary>Keeps the active binding property in sync with the widget's state.
        /// </summary>
        /// <param name='element' type='DOMNode'></param>
        /// <param name='valueAccessor' type='Function'></param>
        /// <returns type='Object'></returns>

        var value = valueAccessor();

        exports.BindingHandler.prototype.init.apply(this, arguments);

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

    exports.Accordion = Accordion;

    exports.bindingHandlerRegistry.register(new Accordion());
}());