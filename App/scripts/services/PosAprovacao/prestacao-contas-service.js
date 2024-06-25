(function () {
    "use strict";
    angular
        .module("fac")
        .factory("prestacaoContasService", ["$location", "apiService", "notificacaoService",
            function ($location, apiService, notificacaoService) {

                debugger;

                var getList = function () {
                    return apiService.get("prestacaoContas");
                };

                var get = function (options) {
                    debugger;
                    return apiService.get("prestacaoContas/" + options.id);
                };

                var getPrestacaoContasAprovacao = function (options) {
                    return apiService.get("prestacaoContas/GetPrestacaoContasAprovacao/" + options.id);
                };

                ////var getTipos = function (options) {
                ////    return apiService.get("prestacaoContas/GetTipos");
                ////};

                var addThenToPromisse = function (promisse) {
                    promisse.then(function () {
                        notificacaoService.showSuccess("Prestação de contas salvo com sucesso.");
                        $location.path("/prestacaoContas");
                    });

                    return promisse;
                }

                var salvePost = function (options) {
                    var promisse = apiService.post("prestacaoContas", options.objeto);
                    return addThenToPromisse(promisse);
                };

                var salvePut = function (options) {
                    var promisse = apiService.put("prestacaoContas", options.objeto);
                    return addThenToPromisse(promisse);
                };

                var download = function (options) {
                    return apiService.post("prestacaoContas/Download/" + options.id);
                }; 

                var aceite = function (options) {
                    var data = {
                        "id": options.id,
                        "motivoRecusa": options.observacao
                    }

                    return apiService.post("prestacaoContas/Aceite/", data);
                };

                var recuse = function (options) {
                    debugger;
                    var data = {
                        "id": options.id,
                        "motivoRecusa": options.observacao
                    }

                    return apiService.post("prestacaoContas/Recuse/", data);
                };

                return {
                    getList: getList,
                    get: get,
                    salvePost: salvePost,
                    salvePut: salvePut,
                    download: download,
                    getPrestacaoContasAprovacao: getPrestacaoContasAprovacao,
                    aceite: aceite,
                    recuse: recuse
                }
            }]);
})();