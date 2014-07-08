/*global define*/
/*jslint browser:true*/
define(

    [
        'jquery',
        'knockout',
        './bindingHandler',
        './utils',
        'jquery-ui/dialog'
    ],

    function ($, ko, BindingHandler, utils, dialog) {

        'use strict';

        var Dialog = function () {
            /// <summary>Constructor.</summary>

            var version = utils.parseVersionString(dialog.version);

            BindingHandler.call(this, 'dialog');

            if (version.major === 1 && version.minor === 8) {
                this.options = ['autoOpen', 'buttons', 'closeOnEscape', 'closeText',
                    'dialogClass', 'disabled', 'draggable', 'height', 'maxHeight',
                    'maxWidth', 'minHeight', 'minWidth', 'modal', 'position', 'resizable',
                    'show', 'stack', 'title', 'width', 'zIndex'];
                this.events = ['beforeClose', 'create', 'open', 'focus', 'dragStart',
                    'drag', 'dragStop', 'resizeStart', 'resize', 'resizeStop', 'close'];
            } else if (version.major === 1 && version.minor === 9) {
                this.options = ['autoOpen', 'buttons', 'closeOnEscape', 'closeText',
                    'dialogClass', 'draggable', 'height', 'hide', 'maxHeight', 'maxWidth',
                    'minHeight', 'minWidth', 'modal', 'position', 'resizable', 'show',
                    'stack', 'title', 'width', 'zIndex'];
                this.events = ['beforeClose', 'create', 'open', 'focus', 'dragStart',
                    'drag', 'dragStop', 'resizeStart', 'resize', 'resizeStop', 'close'];
            } else {
                this.options = ['appendTo', 'autoOpen', 'buttons', 'closeOnEscape',
                    'closeText', 'dialogClass', 'draggable', 'height', 'hide',
                    'maxHeight', 'maxWidth', 'minHeight', 'minWidth', 'modal', 'position',
                    'resizable', 'show', 'title', 'width'];
                this.events = ['beforeClose', 'create', 'open', 'focus', 'dragStart',
                    'drag', 'dragStop', 'resizeStart', 'resize', 'resizeStop', 'close'];
            }
        };

        Dialog.prototype = utils.createObject(BindingHandler.prototype);
        Dialog.prototype.constructor = Dialog;

        Dialog.prototype.init = function (element, valueAccessor) {
            /// <summary>Creates a hidden div before the element. This helps in disposing
            /// the binding if the element is moved from its original location.
            /// Keeps the isOpen binding property in sync with the dialog's state.
            // </summary>
            /// <param name='element' type='DOMNode'></param>
            /// <param name='valueAccessor' type='Function'></param>
            /// <returns type='Object'></returns>

            var marker, value;

            /// sets up the correct disposal
            marker = document.createElement('DIV');
            marker.style.display = 'none';
            element.parentNode.insertBefore(marker, element);

            ko.utils.domNodeDisposal.addDisposeCallback(marker, function () {
                ko.removeNode(element);
            });

            /// invokes the prototype's init() method
            BindingHandler.prototype.init.apply(this, arguments);

            /// sets up handling of the isOpen option
            value = valueAccessor();

            if (value.isOpen) {
                ko.computed({
                    read: function () {
                        if (ko.utils.unwrapObservable(value.isOpen)) {
                            $(element).dialog('open');
                        } else {
                            $(element).dialog('close');
                        }
                    },
                    disposeWhenNodeIsRemoved: element
                });
            }
            if (ko.isWriteableObservable(value.isOpen)) {
                $(element).on('dialogopen.dialog', function () {
                    value.isOpen(true);
                });
                $(element).on('dialogclose.dialog', function () {
                    value.isOpen(false);
                });
            }

            // make the width option two-way
            if (ko.isWriteableObservable(value.width)) {
                /*jslint unparam:true*/
                $(element).on('dialogresizestop.dialog', function (ev, ui) {
                    value.width(Math.round(ui.size.width));
                });
                /*jslint unparam:false*/
            }

            // make the height option two-way
            if (ko.isWriteableObservable(value.height)) {
                /*jslint unparam:true*/
                $(element).on('dialogresizestop.dialog', function (ev, ui) {
                    value.height(Math.round(ui.size.height));
                });
                /*jslint unparam:false*/
            }

            // handle disposal
            ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
                $(element).off('.dialog');
            });

            // the inner elements have already been taken care of
            return { controlsDescendantBindings: true };
        };

        utils.register(Dialog);

        return Dialog;
    }
);
