/*global $, bindingFactory, versions*/
(function () {
    'use strict';

    var events, postInit;

    switch (versions.jQueryUI) {
    case '1.8':
        events = ['change', 'close', 'create', 'focus', 'open', 'search', 'select'];
        break;
    case '1.9':
    case '1.10':
        events = ['change', 'close', 'create', 'focus', 'open', 'response', 'search',
        'select'];
        break;
    }

    postInit = function (element, valueAccessor) {
        /// <summary>Adds a binding for selectedItem, selectedValue, selectedLabel
        /// </summary>
        /// <param name='element' type='DOMNode'></param>
        /// <param name='valueAccessor' type='Function'></param>

        var value = valueAccessor();

        if (value.selectedItem) {
            if (ko.isWriteableObservable(value.selectedItem)) {
                $(element).on('autocompleteselect', function (evt, ui) {
                    value.selectedItem(ui.item);
                    return false;
                });
            }
        }

        if (value.selectedValue) {
            if (ko.isWriteableObservable(value.selectedValue)) {
                $(element).on('autocompleteselect', function (evt, ui) {
                    value.selectedValue(ui.item.value);
                    return false;
                });
            }
        }

        if (value.selectedLabel) {
            if (ko.isWriteableObservable(value.selectedLabel)) {
                $(element).on('autocompleteselect', function (evt, ui) {
                    value.selectedLabel(ui.item.label);
                    return false;
                });
            }
        }
    };

    bindingFactory.create({
        name: 'autocomplete',
        options: ['appendTo', 'autoFocus', 'delay', 'disabled', 'minLength', 'position',
            'source'],
        events: events,
        postInit: postInit
    });
}());