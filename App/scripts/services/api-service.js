(function () {
    "use strict";

    angular
        .module("app.core")
        .factory("apiService", ["$rootScope", "$http", "utilitariosService", "notificacaoService",
            function ($rootScope, $http, utilitariosService, notificacaoService) {
                var urlPrefix = "api/";

                var post = function (url, data, config) {
                    return getPromise($http.post(urlPrefix + url, data, config));
                };

                var put = function (url, data, config) {
                    return getPromise($http.put(urlPrefix + url, data, config));
                };

                var del = function (url, config) {
                    return getPromise($http.delete(urlPrefix + url, config));
                };

                var get = function (url, config) {
                    return getPromise($http.get(urlPrefix + url, config));
                };

                var jsonp = function (url, config) {
                    return getPromise($http.jsonp(urlPrefix + url, config));
                };

                var done = function (response) {
                };

                var getApiCep = function (data) {
                    var urlService = "https://goias360.seduce.go.gov.br/services/util/GetLogradouro";
                    return getPromise($http.post(urlService, data));
                }

                var error = function (response) {
                    var data = response.data;

                    if (response.status === 400) {
                        if (utilitariosService.possuiValor(data) && data.constructor === Array) {
                            $rootScope.errosDeValidacao = data;
                            notificacaoService.showError(utilitariosService.msgVerifiqueInconsistencias);

                            utilitariosService.scrollToElement($("#inconsistencias"));

                            return;
                        }
                    }

                    if (response.status === 401) {
                        utilitariosService.operacaoNaoAutorizada();
                        return;
                    }

                    if (utilitariosService.possuiValor(data.error_description)) {
                        notificacaoService.showError(data.error_description);
                    }

                    if (response.status === 500) {
                        notificacaoService.showError("Erro interno do servidor.");
                    }
                };

                var getPromise = function (promise) {
                    promise.then(done).catch(error);
                    return promise;
                };

                return {
                    post: post,
                    put: put,
                    del: del,
                    get: get,
                    jsonp: jsonp,
                    getApiCep: getApiCep
                };
            }]);
})();