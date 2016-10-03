/*jshint strict: false */
/*global define*/
define(

    [
        './bindingHandler',
        './utils',
        'jquery-ui/controlgroup'
    ],

    function (BindingHandler, utils) {

        var Controlgroup = function () {
            /// <summary>Constructor.</summary>

            BindingHandler.call(this, 'controlgroup');

            this.options = ['classes', 'direction', 'disabled', 'items', 'onlyVisible'];
            this.events = ['create'];
            this.hasRefresh = true;
        };

        Controlgroup.prototype = utils.createObject(BindingHandler.prototype);
        Controlgroup.prototype.constructor = Controlgroup;

        utils.register(Controlgroup);

        return Controlgroup;
    }
);
