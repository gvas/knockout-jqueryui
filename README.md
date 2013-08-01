[![Build Status](https://travis-ci.org/gvas/knockout-jqueryui.png)](https://travis-ci.org/gvas/knockout-jqueryui) [![Selenium Test Status](https://saucelabs.com/buildstatus/gvas)](https://saucelabs.com/u/gvas)

[Knockout](http://knockoutjs.com/) bindings for the [jQuery UI](http://jqueryui.com/) widgets.

Documentation
-------------
[http://gvas.github.com/knockout-jqueryui/](http://gvas.github.com/knockout-jqueryui/)

Build
-----
    git clone git://github.com/gvas/knockout-jqueryui.git knockout-jqueryui
    cd knockout-jqueryui
    npm install -g grunt-cli
    npm install
    grunt

Tests
-----
    grunt dev
will spin up a web server on port 9999. After that you can run the tests in your browser of choice at

    http://localhost:9999/SpecRunner.html

Optionally specify the versions of the jQuery, jQuery UI and Knockout libraries to run the tests against by passing the version numbers as query parameters:

    http://localhost:9999/SpecRunner.html?jquery=1.10.2&jqueryui=1.9.2&knockout=2.3.0
Note that jQuery UI 1.8 is only compatible with jQuery <= 1.8
