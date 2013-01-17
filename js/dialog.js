/*globals ko*/
/*jslint browser:true*/
var logEvent, noop, numberOfButtonsChanged, VM;

logEvent = function (eventName) {
    this.events(this.events() + eventName + '\r\n');
};

noop = function () { };

numberOfButtonsChanged = function (newValue) {
    /*jslint white:true*/
    switch (newValue) {
        case '0':
            this.buttons([]);
            break;
        case '1':
            this.buttons({ Ok: noop });
            break;
        case '2':
            this.buttons({ Ok: noop, Cancel: noop });
            break;
    }
    /*jslint white:false*/
};

VM = function () {
    var self = this;

    this.autoOpen = ko.observable(true);
    this.buttons = ko.observable({});
    this.closeOnEscape = ko.observable(true);
    this.closeText = ko.observable('close');
    this.dialogClass = ko.observable('');
    this.draggable = ko.observable(true);
    this.height = ko.observable('auto');
    this.hide = ko.observable(null);
    this.maxHeight = ko.observable(false);
    this.maxWidth = ko.observable(false);
    this.minHeight = ko.observable(150);
    this.minWidth = ko.observable(150);
    this.modal = ko.observable(false);
    this.position = ko.observable({ my: 'center', at: 'center', of: window });
    this.resizable = ko.observable(true);
    this.show = ko.observable(null);
    this.stack = ko.observable(true);
    this.title = ko.observable('');
    this.width = ko.observable(300);
    this.zIndex = ko.observable(1000);

    this.isOpen = ko.observable(true);

    ko.utils.arrayForEach(['beforeClose', 'create', 'open', 'focus', 'dragStart', 'drag',
        'dragStop', 'resizeStart', 'resize', 'resizeStop', 'close'],
        function (eventName) {
            VM.prototype[eventName] = logEvent.bind(self, eventName);
        });

    this.events = ko.observable('');
    this.numberOfButtons = ko.observable('0');

    this.numberOfButtons.subscribe(numberOfButtonsChanged, this);
};

ko.applyBindings(new VM());