// creates the dialog-inherited widget
$.widget("custom.minidialog", $.ui.dialog, {
    _create: function () {
        var that = this,
            uiDialogTitlebarMinimize;

        // invoke the base widget's _create() method
        this._super();

        // the unique class helps to define the selectors for the custom css rules
        this.uiDialog.addClass("custom-minidialog");

        // the state is stored in a member variable
        this.minimized = false;

        // adds the minimize/restore anchor to the titlebar
        uiDialogTitlebarMinimize = $("<a href='#'></a>")
            .addClass("custom-minidialog-titlebar-additionalicon ui-corner-all")
            .attr("role", "button")
            .click(function (event) {
                event.preventDefault();
                that._toggleState(event);
            })
            .appendTo(this.uiDialogTitlebar);

        // sets the icon
        (this.uiDialogTitlebarMinimizeText = $("<span>"))
            .addClass("ui-icon ui-icon-minus")
            .text("minimize")
            .appendTo(uiDialogTitlebarMinimize);

        this._hoverable(uiDialogTitlebarMinimize);
        this._focusable(uiDialogTitlebarMinimize);
    },
    _toggleState: function (event) {
        this.minimized ? this.restore(event) : this.minimize(event);
    },
    minimize: function (event) {
        // swaps the icon
        this.uiDialogTitlebarMinimizeText
            .removeClass("ui-icon-minus")
            .addClass("ui-icon-newwin")
            .text("restore");
        // hides the content
        this.element.hide();
        // stores the state in the member variable
        this.minimized = true;
        // raises the minidialogminimize event
        this._trigger("minimize", event);
    },
    restore: function (event) {
        // opposite of the minimize() method
        this.uiDialogTitlebarMinimizeText
            .removeClass("ui-icon-newwin")
            .addClass("ui-icon-minus")
            .text("minimize");
        this.element.show();
        this.minimized = false;
        this._trigger("restore", event);
    }
});

// The binding's constructor function.
var Minidialog = function () {
    // invoke the base class's constructor
    kojqui.Dialog.call(this);

    // override/extend the base class's properties
    this.widgetName = "minidialog";
    this.widgetEventPrefix = "minidialog";
    this.events.push("minimize", "restore");
};

// Set the prototype chain. kojqui.utils.createObject() is a simple wrapper around
// Object.create() which also works with pre-ES5 browsers.
Minidialog.prototype = kojqui.utils.createObject(kojqui.Dialog.prototype);
Minidialog.prototype.constructor = Minidialog;

Minidialog.prototype.init = function (element, valueAccessor) {
    var value = valueAccessor();

    // invokes the base class's init() method
    kojqui.Dialog.prototype.init.apply(this, arguments);

    // connects the viewmodel's 'minimized' observable to the widget
    if (value.minimized) {
        ko.computed({
            read: function () {
                if (ko.utils.unwrapObservable(value.minimized)) {
                    $(element).minidialog('minimize');
                } else {
                    $(element).minidialog('restore');
                }
            },
            disposeWhenNodeIsRemoved: element
        });
    }
    if (ko.isWriteableObservable(value.minimized)) {
        this.on(element, 'minimize', function () {
            value.minimized(true);
        });
        this.on(element, 'restore', function () {
            value.minimized(false);
        });
    }

    return { controlsDescendantBindings: true };
};

// Register the new binding handler with knockout.
kojqui.utils.register(Minidialog);

// It's time to test our new widget and binding handler.
vm2 = {
    minimized: ko.observable(false),
    isOpen: ko.observable(false)
};