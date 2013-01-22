/*global kojqui*/
(function () {
    'use strict';

    kojqui.bindingFactory.create({
        name: 'progressbar',
        options: ['disabled', 'max', 'value'],
        events: ['change', 'create', 'complete']
    });
}());