(function () {
    "use strict";

    angular
        .module("fac")
        .controller("tipoDocumentoListagemController", ["$rootScope", "$scope", "$location", "tipoDocumentoService", "utilitariosService", "entidadeService", "opcoes",
            function ($rootScope, $scope, $location, tipoDocumentoService, utilitariosService, entidadeService, opcoes) {
                $scope.tiposDocumentos = {};

                tipoDocumentoService.getLista().then(function (response) {
                    $scope.tiposDocumentos = response.data;
                });

                $scope.nova = function () {
                    $location.path("/tipoDocumento/novo");
                };

                $scope.exclua = function (id) {
                    entidadeService.del({ entidade: opcoes.entidade, id: id });
                };
            }])
        .controller("tipoDocumentoManutencaoController", ["$rootScope", "$scope", "$location", "$routeParams", "opcoes", "tipoDocumentoService", "utilitariosService", "accountService",
            function ($rootScope, $scope, $location, $routeParams, opcoes, tipoDocumentoService, utilitariosService, accountService) {
                var conta = accountService.getAccount();
                $scope.acao = utilitariosService.obtenhaLabelAcao(opcoes.modoEdicao);
                $scope.tiposPessoa = { 1: 'Pessoa Física', 2: 'Pessoa Jurídica' };

                if (!utilitariosService.possuiValor(conta) || conta.role !== utilitariosService.roles.administrador) {
                    utilitariosService.operacaoNaoAutorizada("/home");
                };

                if (opcoes.modoEdicao) {
                    tipoDocumentoService.get({ id: $routeParams.id }).then(function (response) {
                        $scope.tipoDocumento = response.data;
                    });
                }

                $rootScope.submitForm = function () {
                    if (opcoes.modoEdicao) {
                        tipoDocumentoService.salvePut({ objeto: $scope.tipoDocumento });
                        return;
                    }

                    tipoDocumentoService.salvePost({ objeto: $scope.tipoDocumento });
                };

                $scope.cancele = function () {
                    $location.path("/" + opcoes.entidade);
                };
            }]);


})();