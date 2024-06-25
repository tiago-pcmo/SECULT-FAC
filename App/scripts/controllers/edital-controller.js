(function () {
    "use strict";

    angular
        .module("fac")
        .controller("editalController", ["$scope", "$location", "entidadeService", "opcoes", "accountService", "utilitariosService",
            function ($scope, $location, entidadeService, opcoes, accountService, utilitariosService) {
                var conta = accountService.getAccount();

                if (utilitariosService.possuiValor(conta)) {
                    if (conta.role === utilitariosService.roles.administrador) {
                        entidadeService.getLista({ entidade: opcoes.entidade }).then(function (response) {
                            $scope.editais = response.data;
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
        .controller("editalManutencaoController", ["$rootScope", "$scope", "$location", "$routeParams", "opcoes", "accountService", "entidadeService", "editalService", "utilitariosService", "$confirm",
            function ($rootScope, $scope, $location, $routeParams, opcoes, accountService, entidadeService, editalService, utilitariosService, $confirm) {
                $scope.modoEdicao = opcoes.modoEdicao;
                $scope.acao = utilitariosService.obtenhaLabelAcao($scope.modoEdicao);
                $scope.anos = [2016, 2017, 2018, 2019, 2020];
                $scope.opcoesFase = {};
                $scope.editalPossuiFichasVinculadas = false;
                $scope.opcoesAcoesPosteriores = {};

                var conta = accountService.getAccount();

                if (utilitariosService.possuiValor(conta)) {
                    if (conta.role === utilitariosService.roles.administrador) {
                        $scope.opcoesModalidade = {
                            getTotaisModalidade: function (modalidade) {
                                var totais = {
                                    totalProjetos: 0,
                                    totalValores: 0
                                };

                                if (utilitariosService.possuiValor(modalidade)) {
                                    if (utilitariosService.possuiValor(modalidade.modulos)) {
                                        var modulos = modalidade.modulos;
                                        var totalProjetos = 0;
                                        var totalValores = 0;

                                        for (var i = 0; i < modulos.length; i++) {
                                            totalProjetos += +modulos[i].qtdDeProjetosAprovados;
                                            totalValores += +modulos[i].valor * +modulos[i].qtdDeProjetosAprovados;
                                        }

                                        totais.totalProjetos = totalProjetos;
                                        totais.totalValores = totalValores;
                                    }
                                }

                                return totais;
                            }
                        };

                        if ($scope.modoEdicao) {
                            entidadeService.get({ entidade: opcoes.entidade, id: $routeParams.id }).then(function (response) {
                                $scope.edital = response.data;
                            });

                            editalService.getEditalPossuiFichaVinculada({ id: $routeParams.id }).then(function (response) {
                                $scope.editalPossuiFichasVinculadas = response.data;
                                $scope.opcoesFase.editalPossuiFichasVinculadas = $scope.editalPossuiFichasVinculadas;
                            });
                        }

                        accountService.getRoles(function (roles) {
                            $scope.opcoesFase.roles = roles;
                        });

                        editalService.getTiposFase().then(function (response) {
                            $scope.opcoesFase.tiposFase = response.data;
                        });

                        editalService.getTiposAcoesPosteriores().then(function (response) {
                            $scope.opcoesAcoesPosteriores.tiposAcoesPosteriores = response.data;
                        });

                        $rootScope.submitForm = function () {
                            var opcoesService = { entidade: opcoes.entidade, objeto: $scope.edital };

                            if ($scope.modoEdicao) {
                                $confirm({
                                    title: "Atenção",
                                    text: "Pode haver fichas de inscrição vinculadas a este edital. Deseja confirmar as modificações?",
                                    ok: "Sim", cancel: "Não"
                                }).then(function () { entidadeService.put(opcoesService); });
                            } else {
                                entidadeService.post(opcoesService);
                            }
                        };

                        $scope.cancele = function () {
                            $location.path("/" + opcoes.entidade);
                        };
                    } else {
                        utilitariosService.operacaoNaoAutorizada("/home");
                    }
                }
            }]);
})();