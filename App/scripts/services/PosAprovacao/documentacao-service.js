(function () {
    "use strict";
    angular
        .module("fac")
        .factory("documentacaoService", ["$location", "apiService", "notificacaoService",
            function ($location, apiService, notificacaoService) {

                var getList = function () {
                    return apiService.get("documentacao");
                };

                var get = function (options) {
                    return apiService.get("documentacao/" + options.id);
                };

                var getDocumentosAprovacao = function (options) {
                    return apiService.get("documentacao/GetDocumentosAprovacao/" + options.id);
                };

                var addThenToPromisse = function (promisse) {
                    promisse.then(function () {
                        notificacaoService.showSuccess("Documento salvo com sucesso.");
                        $location.path("/documentacao");
                    });

                    return promisse;
                }

                var salvePost = function (options) {
                    var promisse = apiService.post("documentacao", options.objeto);
                    return addThenToPromisse(promisse);
                };

                var salvePut = function (options) {
                    var promisse = apiService.put("documentacao", options.objeto);
                    return addThenToPromisse(promisse);
                };

                var download = function (options) {
                    return apiService.post("documentacao/Download/" + options.id);
                }; 

                var aceite = function (options) {
                    return apiService.post("documentacao/Aceite/" + options.id + "/" + options.observacao);
                };

                var recuse = function (options) {
                    return apiService.post("documentacao/Recuse/" + options.id + "/" + options.observacao);
                };

                return {
                    getList: getList,
                    get: get,
                    salvePost: salvePost,
                    salvePut: salvePut,
                    download: download,
                    getDocumentosAprovacao: getDocumentosAprovacao,
                    aceite: aceite,
                    recuse: recuse
                }
            }]);
})();