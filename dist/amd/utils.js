/*global define*/
define(

    [
        'jquery',
        'knockout',
        'jquery-ui/core'
    ],

    function ($, ko) {

        'use strict';

        var match, uiVersion, descendantControllingBindings, createObject, register;

        /*jslint regexp:true*/
        match = ($.ui.version || '').match(/^(\d)\.(\d+)/);
        /*jslint regexp:false*/

        if (!match) {
            uiVersion = null;
        } else {
            uiVersion = {
                major: parseInt(match[1], 10),
                minor: parseInt(match[2], 10)
            };
        }

        descendantControllingBindings = ['foreach', 'if', 'ifnot', 'with', 'html', 'text',
            'options'];

        createObject = Object.create || function (prototype) {
            /// <summary>Simple (incomplete) shim for Object.create().</summary>
            /// <param name='prototype' type='Object' mayBeNull='true'></param>
            /// <returns type='Object'></returns>

            function Type() { }
            Type.prototype = prototype;
            return new Type();
        };

        register = function (Constructor) {
            /// <summary>Registers a binding.</summary>
            /// <param name='Constructor' type='BindingHandler'>The binding handler's
            /// constructor function.</param>

            var handler = new Constructor();

            ko.bindingHandlers[handler.widgetName] = {
                after: ko.utils.arrayGetDistinctValues(
                    descendantControllingBindings.concat(handler.after || [])
                ),
                init: handler.init.bind(handler),
                update: handler.update.bind(handler)
            };
        };

        return {
            uiVersion: uiVersion,
            descendantControllingBindings: descendantControllingBindings,
            createObject: createObject,
            register: register
        };
    }
);
