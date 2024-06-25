(function () {
    "use strict";

    angular
        .module("fac")
        .factory("editalService", ["apiService",
            function (apiService) {
                var getTiposFase = function () {
                    return apiService.get("edital/GetTiposFase");
                };

                var getEditalPossuiFichaVinculada = function (options) {
                    return apiService.get("edital/GetEditalPossuiFichaVinculada/" + options.id);
                };

                var getEditaisEmInscricao = function () {
                    return apiService.get("edital/GetEditaisEmInscricao");
                };

                var getConfiguracoesReferenciaBase = function (options) {
                    return apiService.get("referenciaConfig/GetReferenciaModel/");
                };

                var getTiposAcoesPosteriores = function () {
                    return apiService.get("edital/GetTiposAcoesPosteriores");
                };

                var getEditais = function () {
                    return apiService.get("edital/GetEditais");
                };

                return {
                    getEditais: getEditais,
                    getTiposFase: getTiposFase,
                    getEditalPossuiFichaVinculada: getEditalPossuiFichaVinculada,
                    getEditaisEmInscricao: getEditaisEmInscricao,
                    getConfiguracoesReferenciaBase: getConfiguracoesReferenciaBase,
                    getTiposAcoesPosteriores: getTiposAcoesPosteriores
                };
            }]);
})();