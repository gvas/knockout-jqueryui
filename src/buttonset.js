/*global kojqui*/
(function () {
    'use strict';

    kojqui.bindingFactory.create({
        name: 'buttonset',
        options: ['items', 'disabled'],
        events: ['create'],
        hasRefresh: true
    });
}());