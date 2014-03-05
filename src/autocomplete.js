/*global bindingFactory, versions*/
(function () {
    'use strict';

    var events;

    if (versions.jQueryUI.major === 1 && versions.jQueryUI.minor === 8) {
        events = ['change', 'close', 'create', 'focus', 'open', 'search', 'select'];
    } else {
        events = ['change', 'close', 'create', 'focus', 'open', 'response', 'search',
            'select'];
    }

    bindingFactory.create({
        name: 'autocomplete',
        options: ['appendTo', 'autoFocus', 'delay', 'disabled', 'minLength', 'position',
            'source'],
        events: events
    });
}());