(function () {
    "use strict";

    angular
        .module("fac")
        .factory("proponenteService", ["apiService",
            function (apiService) {
                var getEscolaridades = function () {
                    return apiService.get("proponente/GetEscolaridades");
                };

                var getEscolaridadesSituacoes = function () {
                    return apiService.get("proponente/GetEscolaridadeSituacoes");
                };

                var getAtuacoes = function () {
                    return apiService.get("proponente/GetAtuacoes");
                };

                var getProponenteLogado = function () {
                    return apiService.get("proponente/GetProponenteLogado");
                };

                var getDeclaracaoProponente = function (options) {
                    return apiService.post("proponente/GetDeclaracaoProponente/" + options.id);
                };

                var getDeclaracaoDirigente = function (options) {
                    return apiService.post("proponente/GetDeclaracaoDirigente/" + options.id);
                };

                return {
                    getEscolaridades: getEscolaridades,
                    getEscolaridadesSituacoes: getEscolaridadesSituacoes,
                    getAtuacoes: getAtuacoes,
                    getProponenteLogado: getProponenteLogado,
                    getDeclaracaoProponente: getDeclaracaoProponente,
                    getDeclaracaoDirigente: getDeclaracaoDirigente
                };
            }]);
})();