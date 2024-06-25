(function () {
    "use strict";

    angular
        .module("fac")
        .controller("segmentoListagemController", ["$rootScope", "$scope", "$location", "segmentoService", "utilitariosService", "entidadeService", "opcoes",
            function ($rootScope, $scope, $location, segmentoService, utilitariosService, entidadeService, opcoes) {
                $scope.segmentos = {};
                $scope.opcoesSegmento = {};

                segmentoService.getSegmentosPorReferencia().then(function (response) {
                    $scope.segmentos = response.data;
                });

                $scope.nova = function () {
                    $location.path("/segmento/novo");
                };

                $scope.exclua = function (id) {
                    entidadeService.del({ entidade: opcoes.entidade, id: id });
                };
            }])
        .controller("segmentoManutencaoController", ["$rootScope", "$scope", "$location", "$routeParams", "opcoes", "segmentoService", "utilitariosService", "accountService",
            function ($rootScope, $scope, $location, $routeParams, opcoes, segmentoService, utilitariosService, accountService) {
                var conta = accountService.getAccount();
                $scope.acao = utilitariosService.obtenhaLabelAcao(opcoes.modoEdicao);

                if (!utilitariosService.possuiValor(conta) || conta.role !== utilitariosService.roles.administrador) {
                    utilitariosService.operacaoNaoAutorizada("/home");
                };

                if (opcoes.modoEdicao) {
                    segmentoService.get({ id: $routeParams.id }).then(function (response) {
                        $scope.segmento = response.data;
                    });
                }

                $rootScope.submitForm = function () {
                    $scope.segmento.Referencia = angular.fromJson(localStorage.getItem("fac.selectedReference"));

                    if (opcoes.modoEdicao) {
                        segmentoService.salvePut({ objeto: $scope.segmento });
                        return;
                    }

                    segmentoService.salvePost({ objeto: $scope.segmento });
                };

                $scope.cancele = function () {
                    $location.path("/" + opcoes.entidade);
                };
            }]);
})();