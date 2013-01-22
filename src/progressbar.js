/*global ko*/
(function () {
    'use strict';

    ko.jqueryui.bindingFactory.create({
        name: 'progressbar',
        options: ['disabled', 'max', 'value'],
        events: ['change', 'create', 'complete']
    });
}());