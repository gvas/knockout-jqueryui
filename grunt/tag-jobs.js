/*jslint maxlen:256, node:true*/
module.exports = function (grunt, options) {

    'use strict';

    var request, q, userName, accessKey, baseUrl, auth, tagJobs, tagJob;

    request = require('request');
    q = require('q');
    userName = process.env.SAUCE_USERNAME;
    accessKey = process.env.SAUCE_ACCESS_KEY;
    baseUrl = ['https://saucelabs.com/rest/v1/', userName, '/jobs'].join('');
    auth = { user: userName, pass: accessKey };

    // updates the SauceLabs job with the appropriate tags and name
    tagJobs = function () {

        var options = this.options(),
            buildId = options.buildId,
            done = this.async();

        grunt.log.writeln('Updating SauceLabs tags and name for build ' + buildId);
        q
            .nfcall(request, {
                uri: baseUrl + '?full=true&limit=140',
                auth: auth,
                json: {}
            })
            .then(function (result) {
                var response = result[0],
                    body = result[1],
                    promises;

                if (response.statusCode !== 200) {
                    return q.reject('Failed to fetch the jobs. Status code: ' + response.statusCode);
                }

                promises = body.map(function (info) {
                    return tagJob(buildId, info);
                });

                return q.all(promises);
            })
            .then(function () {
                done();
            })
            .fail(function (error) {
                grunt.log.writeln(error);
                done(false);
            })
            .done();
    };

    tagJob = function (buildId, info) {
        var jobId, logUrl;

        if (!info) {
            return q.reject('Unexpected job info format');
        }
        if (info.build !== buildId) {
            return q.resolve();
        }

        jobId = info.id;
        logUrl = [baseUrl, jobId, 'assets/selenium-server.log'].join('/');

        return q
            .nfcall(request, {
                uri: logUrl,
                auth: auth,
                json: {}
            })
            .then(function (result) {
                var response, body, re, matches;

                response = result[0];
                body = result[1];

                if (response.statusCode !== 200) {
                    return q.reject('Failed to fetch Selenium log for job ' + jobId);
                }

                re = /\/(\w+)\.html\?jquery=([\d\.]+)&jqueryui=([\d\.]+)&knockout=([\d\.]+)/;
                matches = body.match(re);
                if (matches) {
                    grunt.log.writeln('Updating job\'s tags and name.');
                    return q.nfcall(request, {
                        uri: [baseUrl, jobId].join('/'),
                        auth: auth,
                        method: 'PUT',
                        json: {
                            name: matches[1],
                            tags: [
                                'jq:' + matches[2],
                                'jqui:' + matches[3],
                                'ko:' + matches[4]
                            ]
                        }
                    });
                }

                return q.reject('Unexpected selenium server log format. ' + logUrl);
            })
            .fail(function (error) {
                // log the error and continue on with updating the other tasks
                grunt.log.writeln(error);
            });
    };

    grunt.registerTask('tag-jobs', 'Updates the name and tags of a SauceLabs build\'s jobs\'.', tagJobs);

    return {
        options: {
            buildId: options.buildId
        }
    };
};