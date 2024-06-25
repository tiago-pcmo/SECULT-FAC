(function () {
    "use strict";

    angular
        .module("fac")
        .factory("tipoDocumentoService", ["$location", "apiService", "notificacaoService", "utilitariosService",
            function ($location, apiService, noticacaoService, utilitariosService) {
                var getLista = function () {
                    return apiService.get("tipodocumento");
                };

                var get = function (options) {
                    return apiService.get("tipodocumento/" + options.id);
                };

                var salve = function (promisse) {
                    promisse.then(function () {
                        noticacaoService.showSuccess("O Tipo do documento foi salvo com sucesso.");
                        $location.path("/tipoDocumento");
                    });

                    return promisse;
                }

                var salvePost = function (options) {
                    var promisse = apiService.post("tipodocumento", options.objeto);
                    return salve(promisse);
                };

                var salvePut = function (options) {
                    var promisse = apiService.put("tipodocumento", options.objeto);
                    return salve(promisse);
                };

                return {
                    getLista: getLista,
                    get: get,
                    salvePost: salvePost,
                    salvePut: salvePut
                }
            }]);
})();