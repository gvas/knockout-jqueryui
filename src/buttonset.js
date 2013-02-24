/*global bindingFactory*/
(function () {
    'use strict';

    bindingFactory.create({
        name: 'buttonset',
        options: ['items', 'disabled'],
        events: ['create'],
        hasRefresh: true
    });
}());