(function () {
    "use strict";

    angular
        .module("fac")
        .controller('conselheiroController', ["$scope", "$location", "entidadeService", "opcoes", "accountService", "utilitariosService",
            function ($scope, $location, entidadeService, opcoes, accountService, utilitariosService) {
                var conta = accountService.getAccount();

                if (utilitariosService.possuiValor(conta)) {
                    if (conta.role === utilitariosService.roles.administrador) {
                        entidadeService.getLista({ entidade: opcoes.entidade }).then(function (response) {
                            $scope.conselheiros = response.data;
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
        .controller('conselheiroManutencaoController', ["$rootScope", "$scope", "$routeParams", "opcoes", "$location", "entidadeService", "editalService", "utilitariosService", "accountService", "inscricaoService",
            function ($rootScope, $scope, $routeParams, opcoes, $location, entidadeService, editalService, utilitariosService, accountService, inscricaoService) {
                $scope.modoEdicao = opcoes.modoEdicao;
                $scope.acao = utilitariosService.obtenhaLabelAcao($scope.modoEdicao);
                $scope.opcoes = {};

                var conta = accountService.getAccount();

                if (utilitariosService.possuiValor(conta)) {
                    if (conta.role === utilitariosService.roles.administrador) {
                        if ($scope.modoEdicao) {
                            entidadeService.get({ entidade: opcoes.entidade, id: $routeParams.id }).then(function (response) {
                                $scope.conselheiro = response.data;
                            });
                        }

                        $rootScope.submitForm = function () {
                            var opcoesService = { entidade: opcoes.entidade, objeto: $scope.conselheiro };

                            if ($scope.modoEdicao) {
                                entidadeService.put(opcoesService);
                            } else {
                                entidadeService.post(opcoesService);
                            }
                        };

                        $rootScope.cancele = function () {
                            $location.path("/" + opcoes.entidade);
                        };

                        inscricaoService.getFichasParaPareceristas().then(function (response) {
                            var editaisFichas = response.data;
                            $scope.opcoes.editais = editaisFichas.editais;
                            $scope.opcoes.fichasInscricaoOriginal = editaisFichas.fichasInscricaoAcoes;
                        });

                        $scope.opcoes.onChangeEdital = function (edital) {
                            $scope.opcoes.editalSelecionado = edital;
                            $scope.opcoes.modulos = {};
                            $scope.opcoes.modalidadeSelecionada = "";
                            if (utilitariosService.possuiValor(edital)) {
                                $scope.opcoes.modalidades = $scope.opcoes.editalSelecionado.modalidades;
                            }
                        };

                        $scope.opcoes.onChangeModalidade = function (modalidade) {
                            $scope.opcoes.modalidadeSelecionada = modalidade;
                            if (utilitariosService.possuiValor($scope.opcoes.modalidadeSelecionada)) {
                                $scope.opcoes.modulos = $scope.opcoes.modalidadeSelecionada.modulos;
                            }
                        };

                        $scope.opcoes.onchangeModulo = function (modulo) {
                            $scope.opcoes.moduloSelecionado = modulo;

                            if (utilitariosService.possuiValor(modulo)) {
                                $scope.opcoes.fichasInscricao = {};
                                var fichas = [];

                                for (var i = 0; i < $scope.opcoes.fichasInscricaoOriginal.length; i++) {
                                    var ficha = $scope.opcoes.fichasInscricaoOriginal[i].fichaInscricao;
                                    if (ficha.modulo.id === $scope.opcoes.moduloSelecionado.id &&
                                        ficha.edital.id === $scope.opcoes.editalSelecionado.id &&
                                        ficha.modalidade.id === $scope.opcoes.modalidadeSelecionada.id &&
                                        ficha.fichaFinalizada && ficha.habilitacao && ficha.habilitacao.habilitado) {
                                        fichas.push(ficha);
                                    }
                                }

                                $scope.opcoes.fichasInscricao = fichas;
                            }
                        };
                    } else {
                        utilitariosService.operacaoNaoAutorizada("/home");
                    }
                }
            }]);
})();