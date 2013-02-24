/*global bindingFactory*/
(function () {
    'use strict';

    bindingFactory.create({
        name: 'progressbar',
        options: ['disabled', 'max', 'value'],
        events: ['change', 'create', 'complete']
    });
}());