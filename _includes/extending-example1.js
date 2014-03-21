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

kojqui.bindingFactory.create({
    name: "colorizer",
    options: [ "color" ],
    events: []
});

vm1 = {
    color: ko.observable( "black" ),
    toggleColor: function () {
        vm1.color( vm1.color() === "black" ? "red" : "black" );
    }
};