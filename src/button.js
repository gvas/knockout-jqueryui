/*global ko*/
(function () {
    'use strict';

    ko.jqueryui.bindingFactory.create({
        name: 'button',
        options: ['disabled', 'icons', 'label', 'text'],
        events: ['create']
    });
}());