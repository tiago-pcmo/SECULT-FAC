(function () {
    "use strict";

    angular
        .module("fac")
        .factory("funcionarioService", ["$location", "apiService", "notificacaoService",
            function ($location, apiService, notificacaoService) {

                var getList = function () {
                    return apiService.get("funcionario");
                };

                var get = function (options) {
                    return apiService.get("funcionario/" + options.id);
                };

                var addThenToPromisse = function (promisse) {
                    promisse.then(function () {
                        notificacaoService.showSuccess("O funcionário foi salvo com sucesso.");
                        $location.path("/funcionario");
                    });

                    return promisse;
                };

                var salvePost = function (options) {
                    var promisse = apiService.post("funcionario", options.objeto);
                    return addThenToPromisse(promisse);
                };

                var salvePut = function (options) {
                    var promisse = apiService.put("funcionario", options.objeto);
                    return addThenToPromisse(promisse);
                };

                return {
                    getList: getList,
                    get: get,
                    salvePut: salvePut,
                    salvePost: salvePost
                }
            }]);
})();