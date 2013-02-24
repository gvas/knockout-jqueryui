/*global bindingFactory*/
(function () {
    'use strict';

    bindingFactory.create({
        name: 'menu',
        options: ['disabled', 'icons', 'menus', 'position', 'role'],
        events: ['blur', 'create', 'focus', 'select'],
        hasRefresh: true
    });
}());