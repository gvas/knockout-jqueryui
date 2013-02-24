/*global $, ko, bindingFactory*/
(function () {
    'use strict';

    var postInit;

    postInit = function (element, valueAccessor) {
        /// <summary>Keeps the active binding property in sync with the tabs' state.
        /// </summary>
        /// <param name='element' type='DOMNode'></param>
        /// <param name='valueAccessor' type='Function'></param>

        var value = valueAccessor();

        if (ko.isWriteableObservable(value.active)) {
            $(element).on('accordionactivate.ko', function () {
                value.active($(element).accordion('option', 'active'));
            });
        }

        //handle disposal
        ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
            $(element).off('.ko');
        });
    };

    bindingFactory.create({
        name: 'accordion',
        options: ['active', 'animate', 'collapsible', 'disabled', 'event', 'header',
            'heightStyle', 'icons'],
        events: ['activate', 'beforeActivate', 'create'],
        postInit: postInit,
        hasRefresh: true
    });
}());