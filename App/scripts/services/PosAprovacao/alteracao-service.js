(function () {
    "use strict";
    angular
        .module("fac")
        .factory("alteracaoService", ["$location", "apiService", "notificacaoService",
            function ($location, apiService, notificacaoService) {

                var getList = function () {
                    return apiService.get("alteracao");
                };

                var get = function (options) {
                    return apiService.get("alteracao/" + options.id);
                };

                var getAlteracoesAprovacao = function (options) {
                    return apiService.get("alteracao/GetAlteracoesAprovacao/" + options.id);
                };

                var getTipos = function (options) {
                    return apiService.get("alteracao/GetTipos");
                };

                var addThenToPromisse = function (promisse) {
                    promisse.then(function () {
                        notificacaoService.showSuccess("Alteração salva com sucesso.");
                        $location.path("/alteracao");
                    });

                    return promisse;
                }

                var salvePost = function (options) {
                    var promisse = apiService.post("alteracao", options.objeto);
                    return addThenToPromisse(promisse);
                };

                var salvePut = function (options) {
                    var promisse = apiService.put("alteracao", options.objeto);
                    return addThenToPromisse(promisse);
                };

                var download = function (options) {
                    return apiService.post("alteracao/Download/" + options.id);
                }; 

                var aceite = function (options) {
                    var data = {
                        "id": options.id,
                        "motivoRecusa": options.observacao
                    }

                    return apiService.post("alteracao/Aceite/", data);
                };

                var recuse = function (options) {
                    debugger;
                    var data = {
                        "id": options.id,
                        "motivoRecusa": options.observacao
                    }

                    return apiService.post("alteracao/Recuse/", data);
                };

                return {
                    getList: getList,
                    get: get,
                    salvePost: salvePost,
                    salvePut: salvePut,
                    download: download,
                    getAlteracoesAprovacao: getAlteracoesAprovacao,
                    aceite: aceite,
                    recuse: recuse,
                    getTipos: getTipos
                }
            }]);
})();