/*global ko*/
/*jslint maxlen:256*/
(function () {
    'use strict';

    ko.jqueryui.bindingFactory.create({
        name: 'menu',
        options: ['disabled', 'icons', 'menus', 'position', 'role'],
        events: ['blur', 'create', 'focus', 'select']
    });
}());