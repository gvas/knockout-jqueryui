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

// clones and extends the dialog binding's configuration object
var config = $.extend(true, {}, ko.bindingHandlers.dialog.config);
config.name = "minidialog";
config.events.push("minimize", "restore");
config.postInit = function (element, valueAccessor) {
    var value = valueAccessor();

    // copied from the dialog binding's source, changed the widget- and event names
    if (value.isOpen) {
        ko.computed({
            read: function () {
                if (ko.utils.unwrapObservable(value.isOpen)) {
                    $(element).minidialog('open');
                } else {
                    $(element).minidialog('close');
                }
            },
            disposeWhenNodeIsRemoved: element
        });
    }
    if (ko.isWriteableObservable(value.isOpen)) {
        $(element).on('minidialogopen.minidialog', function () {
            value.isOpen(true);
        });
        $(element).on('minidialogclose.minidialog', function () {
            value.isOpen(false);
        });
    }

    // keeps the viewmodel's minimized observable in sync with the widget's state
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
        $(element).on('minidialogminimize.minidialog', function () {
            value.minimized(true);
        });
        $(element).on('minidialogrestore.minidialog', function () {
            value.minimized(false);
        });
    }

    // handles disposal
    ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
        $(element).off('.minidialog');
    });
};
// creates the minidialog binding
kojqui.bindingFactory.create(config);

vm2 = {
    minimized: ko.observable(false),
    isOpen: ko.observable(false)
};