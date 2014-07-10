/*global require*/
require.config({
    baseUrl: './',
    paths: {
        'jquery': 'lib/jquery/jquery-1.11.1.min',
        'jquery-ui': 'lib/jquery-ui/ui',
        'knockout': 'lib/knockout/knockout-3.1.0',
        'knockout-jqueryui': 'lib/knockout-jqueryui'
    }
});

require(

    [
        'knockout',
        'app/viewModel'
    ],

    function (ko, ViewModel) {

        'use strict';

        ko.applyBindings(new ViewModel());
    }
);
