/*global ko, $*/
/*jslint browser:true*/
(function () {
    'use strict';

    var preInit, postInit, match, options, events;

    preInit = function (element) {
        /// <summary>Creates a hidden div before the element. This helps in disposing the
        /// binding if the element is moved from its original location.</summary>
        /// <param name='element' type='DOMNode'></param>

        var marker;

        marker = document.createElement('DIV');
        marker.style.display = 'none';
        element.parentNode.insertBefore(marker, element);

        ko.utils.domNodeDisposal.addDisposeCallback(marker, function () {
            ko.removeNode(element);
        });
    };

    postInit = function (element, valueAccessor) {
        /// <summary>Keeps the isOpen binding property in sync with the dialog's state.
        /// </summary>
        /// <param name='element' type='DOMNode'></param>
        /// <param name='valueAccessor' type='Function'></param>

        var value = valueAccessor();

        if (ko.isObservable(value.isOpen)) {
            ko.computed({
                read: function () {
                    if (value.isOpen()) {
                        $(element).dialog('open');
                    } else {
                        $(element).dialog('close');
                    }
                },
                disposeWhenNodeIsRemoved: element
            });
        }
        if (ko.isWriteableObservable(value.isOpen)) {
            $(element).on('dialogopen.ko', function () {
                value.isOpen(true);
            });
            $(element).on('dialogclose.ko', function () {
                value.isOpen(false);
            });
        }

        //handle disposal
        ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
            $(element).off('ko');
        });
    };

    match = $.ui.version.match(/^(\d\.\d+)\.\d+$/);
    /*jslint white:true*/
    switch (match[1]) {
        case '1.9':
            options = ['autoOpen', 'buttons', 'closeOnEscape', 'closeText', 'dialogClass',
                'draggable', 'height', 'hide', 'maxHeight', 'maxWidth', 'minHeight',
                'minWidth', 'modal', 'position', 'resizable', 'show', 'stack', 'title',
                'width', 'zIndex'];
            events = ['beforeClose', 'create', 'open', 'focus', 'dragStart', 'drag',
                'dragStop', 'resizeStart', 'resize', 'resizeStop', 'close'];
            break;
        case '1.10':
            options = ['appendTo', 'autoOpen', 'buttons', 'closeOnEscape', 'closeText',
                'dialogClass', 'draggable', 'height', 'hide', 'maxHeight', 'maxWidth',
                'minHeight', 'minWidth', 'modal', 'position', 'resizable', 'show',
                'title', 'width'];
            events = ['beforeClose', 'create', 'open', 'focus', 'dragStart', 'drag',
                'dragStop', 'resizeStart', 'resize', 'resizeStop', 'close'];
            break;
        default:
            throw new Error('knockout-jqueryui doesn\'t support this jQuery UI version.');
    }
    /*jslint white:false*/

    ko.jqueryui.bindingFactory.create({
        name: 'dialog',
        options: options,
        events: events,
        preInit: preInit,
        postInit: postInit
    });
}());