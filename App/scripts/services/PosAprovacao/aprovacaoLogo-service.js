(function () {
    "use strict";
    angular
        .module("fac")
        .factory("logoService", ["$location", "apiService", "notificacaoService",
            function ($location, apiService, notificacaoService) {

                var getList = function () {
                    return apiService.get("logo");
                };

                var get = function (options) {
                    return apiService.get("logo/" + options.id);
                };

                var getLogosAprovacao = function (options) {
                    return apiService.get("logo/GetLogosAprovacao/" + options.id);
                };

                var addThenToPromisse = function (promisse) {
                    promisse.then(function () {
                        notificacaoService.showSuccess("Documento salvo com sucesso.");
                        $location.path("/aprovacaoLogo");
                    });

                    return promisse;
                }

                var salvePost = function (options) {
                    var promisse = apiService.post("logo", options.objeto);
                    return addThenToPromisse(promisse);
                };

                var salvePut = function (options) {
                    var promisse = apiService.put("logo", options.objeto);
                    return addThenToPromisse(promisse);
                };

                var download = function (options) {
                    return apiService.post("logo/Download/" + options.id);
                }; 

                var aceite = function (options) {
                    var data = {
                        "id": options.id,
                        "motivoRecusa": options.observacao
                    }

                    return apiService.post("logo/Aceite/",  data);
                };

                var recuse = function (options) {
                    var data = {
                        "id": options.id,
                        "motivoRecusa": options.observacao
                    }

                    return apiService.post("logo/Recuse/", data );
                };

                return {
                    getList: getList,
                    get: get,
                    salvePost: salvePost,
                    salvePut: salvePut,
                    download: download,
                    getLogosAprovacao: getLogosAprovacao,
                    aceite: aceite,
                    recuse: recuse
                }
            }]);
})();