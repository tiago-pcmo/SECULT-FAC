(function () {
    "use strict";

    angular
        .module("fac")
        .factory("entidadeService", ["$location", "$route", "$confirm", "apiService", "utilitariosService", "notificacaoService",
            function ($location, $route, $confirm, apiService, utilitariosService, notificacaoService) {
                var post = function (options) {
                    var promise = apiService.post(options.entidade, options.objeto);

                    promise.then(function () {
                        notificacaoService.showSuccess("Cadastro realizado com sucesso.");
                        $location.path(angular.isUndefined(options.path) ? "/" + options.entidade : options.path);
                    });

                    return promise;
                };

                var put = function (options) {
                    var promise = apiService.put(options.entidade, options.objeto);

                    promise.then(function () {
                        notificacaoService.showSuccess("Edição realizada com sucesso.");
                        $location.path(angular.isUndefined(options.path) ? "/" + options.entidade : options.path);
                    });

                    return promise;
                };

                var del = function (options) {
                    $confirm({ text: utilitariosService.msgEsteItemSeraExcluido })
                        .then(function () {
                            var promise = apiService.del(options.entidade + "/" + options.id);

                            promise.then(function () {
                                notificacaoService.showSuccess("Exclusão realizada com sucesso.");

                                if (angular.isUndefined(options.path)) {
                                    $route.reload();
                                }
                                else {
                                    $location.path(options.path);
                                }
                            });

                            return promise;
                        });
                };

                var getLista = function (options) {
                    return apiService.get(options.entidade);
                };

                var get = function (options) {
                    return apiService.get(options.entidade + "/" + options.id);
                };

                return {
                    post: post,
                    put: put,
                    del: del,
                    getLista: getLista,
                    get: get
                };
            }]);
})();