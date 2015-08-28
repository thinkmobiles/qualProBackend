define([], function () {

    var runApplication = function (success) {
        var url;

        if (!Backbone.history.fragment) {
            Backbone.history.start({silent: true});
        }
        if (success) {
            url = (App.requestedURL === null) ? Backbone.history.fragment : App.requestedURL;

            if ((url === "") || (url === "login")) {
                url = 'qualPro';
            }

            Backbone.history.fragment = "";
            Backbone.history.navigate(url, {trigger: true});
        } else {
            if (App.requestedURL === null) {
                App.requestedURL = Backbone.history.fragment;
            }
            Backbone.history.fragment = "";
            Backbone.history.navigate("login", {trigger: true});
        }
    };

    return {
        runApplication: runApplication
    };
});
