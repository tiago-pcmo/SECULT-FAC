(function () {
    "use strict";
    angular
        .module("fac")
        .factory("referenciaConfigService", ["$location", "apiService", "notificacaoService", "utilitariosService",
            function ($location, apiService, notificacaoService, utilitariosService) {
                var getConfiguracoesReferencia = function () {
                    return apiService.get("referenciaConfig/GetConfiguracoesReferencia");
                };

                var GetConfiguracoesReferenciaSegmento = function () {
                    return apiService.get("referenciaConfig/GetConfiguracoesReferenciaSegmento");
                };

                return {
                    getConfiguracoesReferencia: getConfiguracoesReferencia,
                    GetConfiguracoesReferenciaSegmento: GetConfiguracoesReferenciaSegmento
                };
            }])
})();