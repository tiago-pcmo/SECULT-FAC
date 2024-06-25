(function () {
    "use strict";

    angular
        .module("fac")
        .factory("naturezaService", ["$location", "apiService", "notificacaoService", "utilitariosService",
            function ($location, apiService, notificacaoService, utilitariosService) {
                var getNaturezasPorReferencia = function () {
                    return apiService.get("natureza/GetNaturezasPorReferencia");
                };

                var get = function (options) {
                    return apiService.get("natureza/" + options.id);
                };

                var salvePost = function (options) {
                    var promisse = apiService.post("natureza", options.objeto);

                    promisse.then(function () {
                        notificacaoService.showSuccess("Natureza salva com sucesso.");
                        $location.path("/natureza");
                    });

                    return promisse;
                };

                var salvePut = function (options) {
                    var promisse = apiService.put("natureza", options.objeto);

                    promisse.then(function () {
                        notificacaoService.showSuccess("Natureza salva com sucesso.");
                        $location.path("/natureza");
                    });

                    return promisse;
                };

                return {
                    getNaturezasPorReferencia: getNaturezasPorReferencia,
                    get: get,
                    salvePost: salvePost,
                    salvePut: salvePut
                };

            }]);
})();