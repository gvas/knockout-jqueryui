/*global define*/
define(

    [
        'knockout',
        'knockout-jqueryui/button'
    ],

    function (ko) {

        'use strict';

        var ViewModel = function () {
            this.log = ko.observableArray();
        };

        ViewModel.prototype.click = function () {
            this.log.push('Clicked at ' + (new Date()).toString());
        };

        return ViewModel;
    }
);
