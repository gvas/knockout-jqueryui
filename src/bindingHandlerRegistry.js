/*global exports, ko*/
(function () {

    'use strict';

    var register = function (handler) {
        /// <summary>Registers a binding.</summary>
        /// <param name='handler' type='BindingHandler'>The binding handler.</param>

        ko.bindingHandlers[handler.widgetName] = {
            init: handler.init.bind(handler),
            update: handler.update.bind(handler)
        };
    };

    exports.bindingHandlerRegistry = {
        register: register
    };
}());