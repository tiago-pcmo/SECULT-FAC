(function () {
    "use strict"

    angular
        .module("fac")
        .controller("naturezaListagemController", ["$rootScope", "$scope", "opcoes", "$location", "naturezaService", "entidadeService",
            function ($rootScope, $scope, opcoes, $location, naturezaService, entidadeService) {
                $scope.naturezas = {};
                $scope.opcoesNaturezas = {};

                naturezaService.getNaturezasPorReferencia().then(function (response) {
                    $scope.naturezas = response.data;
                });

                $scope.nova = function () {
                    $location.path("/natureza/novo");
                };

                $scope.exclua = function (id) {
                    entidadeService.del({ entidade: opcoes.entidade, id: id });
                };
            }])
        .controller("naturezaManutencaoController", ["$rootScope", "$scope", "$location", "$routeParams", "opcoes", "naturezaService", "utilitariosService", "accountService",
            function ($rootScope, $scope, $location, $routeParams, opcoes, naturezaService, utilitariosService, accountService) {
                var conta = accountService.getAccount();
                $scope.acao = utilitariosService.obtenhaLabelAcao(opcoes.modoEdicao);

                if (!utilitariosService.possuiValor(conta) || conta.role !== utilitariosService.roles.administrador) {
                    utilitariosService.operacaoNaoAutorizada("/home");
                };

                if (opcoes.modoEdicao) {
                    naturezaService.get({ id: $routeParams.id }).then(function (response) {
                        $scope.natureza = response.data;
                    });
                }

                $rootScope.submitForm = function () {
                    $scope.natureza.Referencia = angular.fromJson(localStorage.getItem("fac.selectedReference"));

                    if (opcoes.modoEdicao) {
                        naturezaService.salvePut({ objeto: $scope.natureza });
                        return;
                    }

                    naturezaService.salvePost({ objeto: $scope.natureza });
                };

                $scope.cancele = function () {
                    $location.path("/" + opcoes.entidade);
                };
            }]);

})();