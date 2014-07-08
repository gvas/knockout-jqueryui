/*global define*/
define(

    [
        'jquery',
        'knockout'
    ],

    function ($, ko) {

        'use strict';

        var parseVersionString, createObject, register;

        parseVersionString = function (version) {
            /// <summary>Returns the major- and minor version from a version string.
            /// </summary>
            /// <param name='version' type='String'></param>
            /// <returns type='Object'></returns>

            /*jslint regexp:true*/
            var match = (version || '').match(/^(\d)\.(\d+)/);
            /*jslint regexp:false*/

            if (!match) {
                return null;
            }

            return {
                major: parseInt(match[1], 10),
                minor: parseInt(match[2], 10)
            };
        };

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
                init: handler.init.bind(handler),
                update: handler.update.bind(handler)
            };
        };

        return {
            parseVersionString: parseVersionString,
            createObject: createObject,
            register: register
        };
    }
);
