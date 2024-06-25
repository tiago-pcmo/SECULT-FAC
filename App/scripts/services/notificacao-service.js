(function () {
    "use strict";

    angular
        .module("app.core")
        .factory("notificacaoService", function () {
            toastr.options = {
                debug: false,
                positionClass: "toast-top-right",
                onclick: null,
                fadeIn: 300,
                fadeOut: 1000,
                timeOut: 4000,
                extendedTimeOut: 1000,
                progressBar: false
            };

            var showSuccess = function (message) {
                toastr.success(message);
            };

            var showInfo = function (message) {
                toastr.info(message);
            };

            var showWarning = function (message) {
                toastr.warning(message);
            };

            var showError = function (error) {
                if (Array.isArray(error)) {
                    error.forEach(function (err) {
                        toastr.error(err);
                    });
                } else {
                    toastr.error(error);
                }
            };

            return {
                showSuccess: showSuccess,
                showInfo: showInfo,
                showWarning: showWarning,
                showError: showError
            };
        });
})();