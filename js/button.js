var VM;

VM = function () {
    this.disabled = ko.observable(false);
    this.icons = ko.observable({
        primary: null,
        secondary: null
    });
    this.label = ko.observable('Label');
    this.text = ko.observable(true);
    this.iconsRadio = ko.observable('0');
    this.iconsRadio.subscribe(function (newValue) {
        switch (newValue) {
            case '0':
                this.icons({
                    primary: null,
                    secondary: null
                });
                break;
            case '1':
                this.icons({
                    primary: 'ui-icon-gear',
                    secondary: null
                });
                break;
            case '2':
                this.icons({
                    primary: null,
                    secondary: 'ui-icon-gear'
                });
                break;
        }
    }, this);
};

ko.applyBindings(new VM());