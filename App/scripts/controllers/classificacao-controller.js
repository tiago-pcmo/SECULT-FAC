(function () {
    "use strict";
    angular
        .module("fac")
        .controller("classificacaoController", ["$scope", "$location", "entidadeService", "opcoes", "accountService", "utilitariosService", "$routeParams", "inscricaoService",
            function ($scope, $location, entidadeService, opcoes, accountService, utilitariosService, $routeParams, inscricaoService) {
                $scope.id = $routeParams.id;
                $scope.ficha = {};
                $scope.acoes = {};

                var conta = accountService.getAccount();

                $scope.salvarSituacao = function () {
                    inscricaoService.classificarFicha({ id: $scope.id, classificacao: $scope.ficha.aprovado })
                };

                if (conta.role != utilitariosService.roles.administrador) {
                    utilitariosService.operacaoNaoAutorizada("/home");
                } else {
                    inscricaoService.getFichaInscricao({ id: $scope.id }).then(function (response) {
                        if (response.data) {
                            $scope.ficha = response.data.fichaInscricao;
                            $scope.acoes = response.data.acoes;
                        }
                    });
                };
            }]);
})();