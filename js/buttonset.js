/*globals ko*/
var counter, VM, ButtonVM;

counter = 0;

VM = function () {
    this.disabled = ko.observable(false);
    this.buttons = ko.observableArray([new ButtonVM('foo'), new ButtonVM('bar')]);
    this.newButtonLabel = ko.observable('');
};

VM.prototype.addButton = function () {
    this.buttons.push(new ButtonVM(this.newButtonLabel()));
};

ButtonVM = function (label) {
    this.label = label;
    this.id = 'button' + counter.toString();
    counter += 1;
};

ko.applyBindings(new VM());