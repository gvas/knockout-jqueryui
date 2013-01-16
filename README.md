[Knockout](http://knockoutjs.com/) bindings for the [jQuery UI](http://jqueryui.com/) widgets.

Highlights
---
* Small size
* The bindings' observable parameters are isolated from each other and from those of the other bindings on the same element. If one of the parameters changes, it won't trigger an update of the other parameters.
* The bindings are properly disposed when their elements or their elements' ancestors are removed from the DOM by ko.removeNode either directly or indirectly by the template binding.
* Synchronous operation. No setTimeout() when applying the bindings.
* As a workaround for the z-index bug in old IE browsers, some jQuery UI widgets (dialog) moves the elements onto which they are applied to the end of the DOM tree. This causes the bindings' init method to be called twice. The knockout-jqueryui bindings are protected against multiple initializations.

API
---
Each binding has parameters corresponding to each of the widgets' options. These can be set to either static or observable properties of the viewmodel. Example:

Each binding has parameters corresponding to each of the widgets' events. These can be set to the functions of the viewmodel. The bindings invoke these functions with the this context set to the viewmodel. Example:

Each binding has a refreshOn parameter. If set to one of the viewmodel's observables, then every time that observable changes, the widget is refreshed. This parameter makes it very easy to refresh container-like widgets (tabs, accordion) when they children are updated. Example:

Each binding has a widget parameter. If set to one of the viewmodel's observables, then the binding will write the widget instance into it.

Demo
---

*	[Button](http://jsfiddle.net/gh/get/library/pure/gvas/knockout-jqueryui/tree/master/demo/button/)
