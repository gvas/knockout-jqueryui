/*global ko, $, jasmine, describe, it, beforeEach, afterEach, spyOn, expect*/
/*jslint maxlen:256,browser:true*/
(function () {
    'use strict';

    var getMajorMinorVersion, testWidgetOptions;

    getMajorMinorVersion = function (version) {
        /// <summary>Returns the major.minor version from the version string.</summary>
        /// <param name='version' type='String'></param>
        /// <returns type='String'></returns>

        var match = (version || '').match(/^\d\.\d+/);

        return match ? match[0] : null;
    };

    testWidgetOptions = function (widgetName, optionNamesAndValues) {
        /// <summary>Tests that changing an observable option in the viewmodel updates the
        /// corresponding widget option.</summary>
        /// <param name='widgetName' type='String'></param>
        /// <param name='optionNamesAndValues' type='Object'>Map of widget option names
        /// and values to test them with.</param>

        var prop, initialValue, newValue, $wrapper, $element, vm;

        $wrapper = $('<div></div>').prependTo('body');
        for (prop in optionNamesAndValues) {
            if (optionNamesAndValues.hasOwnProperty(prop)) {
                initialValue = optionNamesAndValues[prop][0];
                newValue = optionNamesAndValues[prop][1];
                $element = $('<div data-bind="' + widgetName + ': { ' + prop + ': observableProperty }"></div>').prependTo($wrapper);
                vm = { observableProperty: ko.observable(initialValue) };

                ko.applyBindings(vm, $element[0]);

                expect($element[widgetName]('option', prop)).toEqual(initialValue);
                vm.observableProperty(newValue);
                expect($element[widgetName]('option', prop)).toEqual(newValue);

                ko.removeNode($element[0]);
            }
        }
        $wrapper.remove();
    };

    window.testWidgetOptions = testWidgetOptions;
    window.getMajorMinorVersion = getMajorMinorVersion;
}());