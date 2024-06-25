(function () {
    "use strict";

    angular
        .module("fac")
        .factory("segmentoService", ["$location", "apiService", "notificacaoService", "utilitariosService",
            function ($location, apiService, notificacaoService, utilitariosService) {
                var getSegmentos = function () {
                    return apiService.get("segmento");
                };

                var getSegmentosPorReferencia = function () {
                    return apiService.get("segmento/GetSegmentosPorReferencia");
                };

                var get = function (options) {
                    return apiService.get("segmento/" + options.id);
                };

                var salvePost = function (options) {
                    var promise = apiService.post("segmento", options.objeto);

                    promise.then(function () {
                        notificacaoService.showSuccess("Segmento salvo com sucesso.");
                        $location.path(angular.isUndefined(options.path) ? "/segmento" : options.path);
                    });

                    return promise;
                };

                var salvePut = function (options) {
                    var promise = apiService.put("segmento", options.objeto);

                    promise.then(function () {
                        notificacaoService.showSuccess("Segmento salvo com sucesso.");
                        $location.path("/segmento");
                    });

                    return promise;
                };

                return {
                    getSegmentos: getSegmentos,
                    getSegmentosPorReferencia: getSegmentosPorReferencia,
                    get: get,
                    salvePost: salvePost,
                    salvePut: salvePut
                };
            }]);
})();