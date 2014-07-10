// Create the widget.
$.widget( "custom.colorizer", {
    options: {
        color: "black"
    },
    _setOption: function ( key, value ) {
        switch ( key ) {
            case "color":
                this.element.css( "color", value );
                break;
        }
        this._super( key, value );
    }
});

// The binding handler's constructor function.
Colorizer = function () {
    // invoke the base class's constructor with the widget's name
    kojqui.BindingHandler.call(this, 'colorizer');

    // specify the widget's options
    this.options = [ "color" ]
};

// Set the prototype chain. kojqui.utils.createObject() is a simple wrapper around
// Object.create() which also works with pre-ES5 browsers.
Colorizer.prototype = kojqui.utils.createObject(kojqui.BindingHandler.prototype);
Colorizer.prototype.constructor = Colorizer;

// Register the new binding handler with knockout.
kojqui.utils.register(Colorizer);

// It's time to test our new widget and binding handler.
vm1 = {
    color: ko.observable( "black" ),
    toggleColor: function () {
        vm1.color( vm1.color() === "black" ? "red" : "black" );
    }
};