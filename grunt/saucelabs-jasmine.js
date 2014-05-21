/*jslint node:true unparam:true*/
module.exports = function (grunt, options) {

    var browsers, testUrls;

    browsers = [{
        browserName: 'chrome',
        platform: 'Windows XP'
    }, {
        browserName: 'opera',
        platform: 'Windows XP'
    }, {
        browserName: 'firefox',
        platform: 'Windows XP'
    }, {
        browserName: 'internet explorer',
        platform: 'Windows XP',
        version: '7'
    }, {
        browserName: 'internet explorer',
        platform: 'Windows XP',
        version: '8'
    }, {
        browserName: 'internet explorer',
        platform: 'Windows 7',
        version: '9'
    }, {
        browserName: 'internet explorer',
        platform: 'Windows 8',
        version: '10'
    }];

    // let's test each supported major and minor version of jQuery UI
    // let's test only the earliest supported and the latest versions of jQuery and
    // knockout
    testUrls = [];
    ['1.8.3', '1.10.2'].forEach(function (jQueryVersion) {
        ['1.8.24', '1.9.2', '1.10.4'].forEach(function (jQueryUIVersion) {
            ['2.2.0', '3.1.0'].forEach(function (knockoutVersion) {
                // jQuery UI 1.8 is compatible only with jQuery <= 1.8
                if (jQueryVersion === '1.8.3' || jQueryUIVersion !== '1.8.24') {
                    // had to split the tests into 2 files, because there is a 64KB limit
                    // on the custom-data field of SauceLabs' REST API which in turn would
                    // cause grunt-saucelabs to fail 
                    ['testRunner1.html', 'testRunner2.html']
                        .forEach(function (testRunner) {
                            testUrls.push(
                                [
                                    'http://127.0.0.1:9999/',
                                    testRunner,
                                    '?',
                                    [
                                        'jquery=' + jQueryVersion,
                                        'jqueryui=' + jQueryUIVersion,
                                        'knockout=' + knockoutVersion
                                    ].join('&')
                                ].join('')
                            );
                        });
                }
            });
        });
    });

    return {
        all: {
            options: {
                urls: testUrls,
                build: options.buildId,
                throttled: 3,
                browsers: browsers,
                sauceConfig: {
                    'video-upload-on-pass': false,
                    'record-screenshots': false
                }
            }
        }
    };
};