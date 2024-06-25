(function () {
    "use strict";
    angular
        .module("fac")
        .factory("catalogacaoService", ["$location", "apiService", "notificacaoService",
            function ($location, apiService, notificacaoService) {
                
                var getList = function () {
                    return apiService.get("catalogacao");
                };

                var get = function (options) {
                    return apiService.get("catalogacao/" + options.id);
                };

                var getCatalogacaoAprovacao = function (options) {
                    return apiService.get("catalogacao/GetCatalogacaoAprovacao/" + options.id);
                };

                var addThenToPromisse = function (promisse) {
                    promisse.then(function () {
                        notificacaoService.showSuccess("Documento salvo com sucesso.");
                        $location.path("/aprovacaocatalogacao");
                    });

                    return promisse;
                }

                var salvePost = function (options) {
                    debugger;
                    var promisse = apiService.post("catalogacao", options.objeto);
                    return addThenToPromisse(promisse);
                };

                var salvePut = function (options) {
                    var promisse = apiService.put("catalogacao", options.objeto);
                    return addThenToPromisse(promisse);
                };

                var download = function (options) {
                    return apiService.post("catalogacao/Download/" + options.id);
                };

                var downloadCatalogacao = function (options) {
                    return apiService.post("catalogacao/Download/" + options.id);
                };

                var aceite = function (options) {
                    var data = {
                        "id": options.id,
                        "motivoRecusa": options.observacao
                    }

                    return apiService.post("catalogacao/Aceite/",  data);
                };

                var recuse = function (options) {
                    var data = {
                        "id": options.id,
                        "motivoRecusa": options.observacao
                    }

                    return apiService.post("catalogacao/Recuse/", data );
                };

                return {
                    getList: getList,
                    get: get,
                    salvePost: salvePost,
                    salvePut: salvePut,
                    download: download,
                    downloadCatalogacao: downloadCatalogacao,
                    getCatalogacaoAprovacao: getCatalogacaoAprovacao,
                    aceite: aceite,
                    recuse: recuse
                }
            }]);
})();