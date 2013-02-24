require.config({
    paths: {
        'jquery': '//ajax.aspnetcdn.com/ajax/jquery/jquery-1.9.1',
        'jquery-ui': '//ajax.aspnetcdn.com/ajax/jquery.ui/1.10.0/jquery-ui',
        'knockout': '//ajax.aspnetcdn.com/ajax/knockout/knockout-2.2.1.debug',
        'knockout-jqueryui': '/build/knockout-jqueryui'
    },
    shim: {
        'jquery-ui': {
            deps: ['jquery']
        }
    }
});

require(['knockout', 'knockout-jqueryui'], function (ko) {
    ko.applyBindings();
});