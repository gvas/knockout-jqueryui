[Knockout](http://knockoutjs.com/) bindings for the [jQuery UI](http://jqueryui.com/) widgets.

Highlights
----------
* Small size
* The bindings' observable parameters are isolated from each other and from those of the other bindings on the same element. If one of the parameters changes, it won't trigger an update of the other parameters.
* The bindings are properly disposed when their elements or their elements' ancestors are removed from the DOM by ko.removeNode either directly or indirectly by the template binding.
* Synchronous operation. No setTimeout() when applying the bindings.
* As a workaround for the z-index bug in old IE browsers, some jQuery UI widgets (dialog) moves the elements onto which they are applied to the end of the DOM tree. This causes the bindings' init method to be called 2 times. The knockout-jqueryui bindings are protected against multiple initializations.
