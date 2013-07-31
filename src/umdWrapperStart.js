/*global require, define, exports*/
/*jslint browser:true, maxlen:256*/
(function (root, factory) {
    'use strict';

    if (typeof exports === 'object') {
        // CommonJS
        factory(exports, require('jquery'), require('knockout'), require('jquery-ui'));
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['exports', 'jquery', 'knockout', 'jquery-ui'], factory);
    } else {
        // Browser globals
        factory((root.kojqui = {}), root.jQuery, root.ko);
    }
} (this, function (exports, $, ko) {
    'use strict';

    var versions, bindingFactory;