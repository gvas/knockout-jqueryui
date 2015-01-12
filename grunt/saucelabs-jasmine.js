/*jslint node:true unparam:true maxlen:256*/

'use strict';

module.exports = function (grunt, options) {
    var request = require('request'),
        q = require('q'),
        userName = process.env.SAUCE_USERNAME,
        accessKey = process.env.SAUCE_ACCESS_KEY,
        baseUrl = ['https://saucelabs.com/rest/v1', userName, 'jobs'].join('/'),
        auth = { user: userName, pass: accessKey },
        browsers,
        testUrls,
        tagJob;

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
        ['1.8.24', '1.9.2', '1.10.4', '1.11.0'].forEach(function (jQueryUIVersion) {
            ['2.2.0', '3.1.0'].forEach(function (knockoutVersion) {
                var queryString;

                // jQuery UI 1.8 is compatible only with jQuery <= 1.8
                if (jQueryVersion === '1.8.3' || jQueryUIVersion !== '1.8.24') {
                    queryString = [
                        'jquery=' + jQueryVersion,
                        'jqueryui=' + jQueryUIVersion,
                        'knockout=' + knockoutVersion
                    ].join('&');

                    testUrls.push(
                        'http://127.0.0.1:9999/spec/runner-all.html?' + queryString
                    );
                }
            });
        });
    });

    tagJob = function (result, callback) {
        var jobId = result.job_id;

        return q
            .nfcall(request, {
                uri: [baseUrl, jobId, 'assets/selenium-server.log'].join('/'),
                auth: auth,
                json: {}
            })
            .then(
                function (result) {
                    var response, body, re, matches;

                    response = result[0];
                    body = result[1];

                    if (response.statusCode !== 200) {
                        grunt.log.error([
                            'GET',
                            [baseUrl, jobId, 'assets/selenium-server.log'].join('/'),
                            '->',
                            response.statusCode
                        ].join(' '));
                        return;
                    }

                    re = /runner-all\.html\?jquery=([\d\.]+)&jqueryui=([\d\.]+)&knockout=([\d\.]+)/;
                    matches = body.match(re);
                    if (matches) {
                        return q
                            .nfcall(request.put, {
                                uri: [baseUrl, jobId].join('/'),
                                auth: auth,
                                json: {
                                    tags: [
                                        'jq:' + matches[1],
                                        'jqui:' + matches[2],
                                        'ko:' + matches[3]
                                    ]
                                }
                            })
                            .fail(function (error) {
                                grunt.log.error([
                                    'PUT',
                                    [baseUrl, jobId].join('/'),
                                    '->',
                                    error.stack
                                ].join(' '));
                            });
                    }

                    grunt.log.error([
                        'GET',
                        [baseUrl, jobId, 'assets/selenium-server.log'].join('/'),
                        '->',
                        'Unexpected log format'
                    ].join(' '));
                },
                function (error) {
                    grunt.log.error([
                        'GET',
                        [baseUrl, jobId, 'assets/selenium-server.log'].join('/'),
                        '->',
                        error.stack
                    ].join(' '));
                }
            )
            .thenResolve(result.passed)
            .nodeify(callback);
    };

    return {
        all: {
            options: {
                urls: testUrls,
                build: process.env.TRAVIS_JOB_ID,
                throttled: 5,
                browsers: browsers,
                tunneled: false,
                maxRetries: 1,
                maxPollRetries: 5,
                onTestComplete: tagJob,
                sauceConfig: {
                    'video-upload-on-pass': false,
                    'record-screenshots': false,
                    'tunnel-identifier': options.tunnelId
                }
            }
        }
    };
};
