/*global ko*/
(function () {
    'use strict';

    ko.jqueryui.bindingFactory.create({
        name: 'buttonset',
        options: ['items', 'disabled'],
        events: ['create']
    });
}());