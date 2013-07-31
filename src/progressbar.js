/*global versions, bindingFactory*/
(function () {
    'use strict';

    var options;

    switch (versions.jQueryUI) {
    case '1.8':
        options = ['disabled', 'value'];
        break;
    case '1.9':
    case '1.10':
        options = ['disabled', 'max', 'value'];
        break;
    }

    bindingFactory.create({
        name: 'progressbar',
        options: options,
        events: ['change', 'create', 'complete']
    });
}());