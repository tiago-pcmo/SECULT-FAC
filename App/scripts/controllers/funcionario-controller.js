(function () {
    "use strict";

    angular
        .module("fac")
        .controller("funcionarioListagemController", ["$rootScope", "$scope", "$location", "$routeParams", "funcionarioService", "utilitariosService", "opcoes", "entidadeService",
            function ($rootScope, $scope, $location, $routeParams, funcionarioService, utilitariosService, opcoes, entidadeService) {

                $scope.funcionarios = {};

                funcionarioService.getList().then(function (response) {
                    $scope.funcionarios = response.data;
                });

                $scope.novo = function () {
                    $location.path("/funcionario/novo");
                };

                $scope.exclua = function (id) {
                    entidadeService.del({ entidade: opcoes.entidade, id: id });
                };
            }])
        .controller("funcionarioManutencaoController", ["$rootScope", "$scope", "$location", "$routeParams", "funcionarioService", "opcoes", "utilitariosService", "accountService",
            function ($rootScope, $scope, $location, $routeParams, funcionarioService, opcoes, utilitariosService, accountService) {

                $scope.modoEdicao = opcoes.modoEdicao;
                $scope.acao = utilitariosService.obtenhaLabelAcao($scope.modoEdicao);

                var conta = accountService.getAccount();

                if (!utilitariosService.possuiValor(conta) || conta.role !== utilitariosService.roles.administrador) {
                    utilitariosService.operacaoNaoAutorizada("/home")
                }

                if ($scope.modoEdicao) {
                    funcionarioService.get({ id: $routeParams.id }).then(function (response) {
                        $scope.funcionario = response.data;
                    });
                }

                $rootScope.submitForm = function () {

                    if ($scope.modoEdicao) {
                        funcionarioService.salvePut({ objeto: $scope.funcionario });
                        return;
                    }

                    funcionarioService.salvePost({ objeto: $scope.funcionario });

                };
            }]);
})();