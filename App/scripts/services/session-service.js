(function () {
    "use strict";

    angular
        .module("app.core")
        .factory("sessionService", ["SESSION_KEY_PREFIX", function (SESSION_KEY_PREFIX) {
            var setItem = function (key, value, sessionStorage) {
                var options = getOptions(key, sessionStorage);
                window[options.target].setItem(options.key, angular.toJson(value));
            };

            var getItem = function (key, sessionStorage) {
                var options = getOptions(key, sessionStorage);
                var value = window[options.target].getItem(options.key);
                return angular.fromJson(value);
            };

            var removeItem = function (key, sessionStorage) {
                var options = getOptions(key, sessionStorage);
                window[options.target].removeItem(options.key);
            };

            var clear = function (sessionStorage) {
                var options = getOptions(sessionStorage);
                var keysToClear = [];

                for (var i = window[options.target].length - 1; i >= 0; i--) {
                    var key = window[options.target].key(i);

                    if (key.indexOf(SESSION_KEY_PREFIX) !== -1) {
                        window[options.target].removeItem(key);
                    }
                }
            };

            var getOptions = function (key, sessionStorage) {
                return {
                    key: SESSION_KEY_PREFIX + key,
                    target: sessionStorage === true ? "sessionStorage" : "localStorage"
                };
            };

            return {
                setItem: setItem,
                getItem: getItem,
                removeItem: removeItem,
                clear: clear
            };
        }]);
})();