/*global kojqui*/
(function () {
    'use strict';

    kojqui.bindingFactory.create({
        name: 'menu',
        options: ['disabled', 'icons', 'menus', 'position', 'role'],
        events: ['blur', 'create', 'focus', 'select'],
        hasRefresh: true
    });
}());