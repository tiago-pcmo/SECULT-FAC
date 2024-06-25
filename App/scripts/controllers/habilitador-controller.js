(function () {
    "use strict";

    angular
        .module("fac")
        .controller("habilitadorController", ["$scope", "$location", "entidadeService", "opcoes", "accountService", "utilitariosService",
            function ($scope, $location, entidadeService, opcoes, accountService, utilitariosService) {
                var conta = accountService.getAccount();

                if (utilitariosService.possuiValor(conta)) {
                    if (conta.role === utilitariosService.roles.administrador) {
                        entidadeService.getLista({ entidade: opcoes.entidade }).then(function (response) {
                            $scope.habilitadores = response.data;
                        });

                        $scope.novo = function () {
                            $location.path("/" + opcoes.entidade + "/novo");
                        };

                        $scope.exclua = function (id) {
                            entidadeService.del({ entidade: opcoes.entidade, id: id });
                        };
                    } else {
                        utilitariosService.operacaoNaoAutorizada("/home");
                    }
                }
            }])
        .controller("habilitadorManutencaoController", ["$rootScope", "$scope", "$location", "$routeParams", "entidadeService", "opcoes", "utilitariosService", "accountService",
            function ($rootScope, $scope, $location, $routeParams, entidadeService, opcoes, utilitariosService, accountService) {
                $scope.modoEdicao = opcoes.modoEdicao;
                $scope.acao = utilitariosService.obtenhaLabelAcao($scope.modoEdicao);

                var conta = accountService.getAccount();

                if (utilitariosService.possuiValor(conta)) {
                    if (conta.role === utilitariosService.roles.administrador) {
                        if ($scope.modoEdicao) {
                            entidadeService.get({ entidade: opcoes.entidade, id: $routeParams.id }).then(function (response) {
                                $scope.habilitador = response.data;
                            });
                        }

                        $rootScope.submitForm = function () {
                            var opcoesService = { entidade: opcoes.entidade, objeto: $scope.habilitador };

                            if ($scope.modoEdicao) {
                                entidadeService.put(opcoesService);
                            } else {
                                entidadeService.post(opcoesService);
                            }
                        };

                        $rootScope.cancele = function () {
                            $location.path("/" + opcoes.entidade);
                        };
                    } else {
                        utilitariosService.operacaoNaoAutorizada("/home");
                    }
                }
            }]);
})();