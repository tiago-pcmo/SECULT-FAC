(function () {
    "use strict";
    angular
        .module("fac")
        .factory("formularioTrimestralService", ["$location", "apiService", "notificacaoService",
            function ($location, apiService, notificacaoService) {

                debugger;

                var getList = function () {
                    return apiService.get("formularioTrimestral");
                };

                var get = function (options) {
                    debugger;
                    return apiService.get("formularioTrimestral/" + options.id);
                };

                var getFormularioTrimestralAprovacao = function (options) {
                    return apiService.get("formularioTrimestral/GetFormularioTrimestralAprovacao/" + options.id);
                };

                ////var getTipos = function (options) {
                ////    return apiService.get("formularioTrimestral/GetTipos");
                ////};

                var addThenToPromisse = function (promisse) {
                    promisse.then(function () {
                        notificacaoService.showSuccess("Formulário trimestral salvo com sucesso.");
                        $location.path("/formularioTrimestral");
                    });

                    return promisse;
                }

                var salvePost = function (options) {
                    var promisse = apiService.post("formularioTrimestral", options.objeto);
                    return addThenToPromisse(promisse);
                };

                var salvePut = function (options) {
                    var promisse = apiService.put("formularioTrimestral", options.objeto);
                    return addThenToPromisse(promisse);
                };

                var download = function (options) {
                    return apiService.post("formularioTrimestral/Download/" + options.id);
                }; 

                var aceite = function (options) {
                    var data = {
                        "id": options.id,
                        "motivoRecusa": options.observacao
                    }

                    return apiService.post("formularioTrimestral/Aceite/", data);
                };

                var recuse = function (options) {
                    debugger;
                    var data = {
                        "id": options.id,
                        "motivoRecusa": options.observacao
                    }

                    return apiService.post("formularioTrimestral/Recuse/", data);
                };

                return {
                    getList: getList,
                    get: get,
                    salvePost: salvePost,
                    salvePut: salvePut,
                    download: download,
                    getFormularioTrimestralAprovacao: getFormularioTrimestralAprovacao,
                    aceite: aceite,
                    recuse: recuse
                }
            }]);
})();