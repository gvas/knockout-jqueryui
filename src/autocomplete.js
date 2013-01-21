/*global ko*/
(function () {
    'use strict';

    ko.jqueryui.bindingFactory.create({
        name: 'autocomplete',
        options: ['appendTo', 'autoFocus', 'delay', 'disabled', 'minLength', 'position',
            'source'],
        events: ['change', 'close', 'create', 'focus', 'open', 'response', 'search',
            'select']
    });
}());