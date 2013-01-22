/*global kojqui*/
(function () {
    'use strict';

    kojqui.bindingFactory.create({
        name: 'button',
        options: ['disabled', 'icons', 'label', 'text'],
        events: ['create'],
        hasRefresh: true
    });
}());