/*global bindingFactory*/
(function () {
    'use strict';

    bindingFactory.create({
        name: 'button',
        options: ['disabled', 'icons', 'label', 'text'],
        events: ['create'],
        hasRefresh: true
    });
}());