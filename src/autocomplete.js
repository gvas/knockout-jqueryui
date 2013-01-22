/*global kojqui*/
(function () {
    'use strict';

    kojqui.bindingFactory.create({
        name: 'autocomplete',
        options: ['appendTo', 'autoFocus', 'delay', 'disabled', 'minLength', 'position',
            'source'],
        events: ['change', 'close', 'create', 'focus', 'open', 'response', 'search',
            'select']
    });
}());