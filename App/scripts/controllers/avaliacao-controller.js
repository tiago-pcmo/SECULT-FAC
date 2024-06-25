(function () {
    "use strict";

    angular
        .module("fac")
        .controller("avaliacaoManutencaoController", ["$rootScope", "$scope", "$location", "$routeParams", "entidadeService", "utilitariosService", "apiService", "inscricaoService", "accountService",
            function ($rootScope, $scope, $location, $routeParams, entidadeService, utilitariosService, apiService, inscricaoService, accountService) {
                $scope.opcoes = {};
                $scope.opcoes.aprovado = "Não";
                $scope.opcoes.faseAvaliacao = false;
                $scope.opcoes.faseRecursoAvaliacao = false;
                $scope.opcoes.faseRespostaRecursoAvaliacao = false;
                $scope.opcoes.usuarioAdministrador = false;
                $scope.opcoes.usuarioProponente = false;
                $scope.opcoes.semFaseCorrenteUsuarioProponente = false;

                var conta = accountService.getAccount();

                if (utilitariosService.possuiValor(conta)) {
                    if (conta.role === utilitariosService.roles.administrador || conta.role === utilitariosService.roles.funcionariofac) {
                        $scope.opcoes.usuarioAdministrador = true;
                    } else if (conta.role === utilitariosService.roles.proponente) {
                        $scope.opcoes.usuarioProponente = true;
                    }

                    inscricaoService.getFichaInscricaoParaAvaliacao({ id: $routeParams.id }).then(function (response) {
                        $scope.opcoes.fichaInscricao = response.data;
                        if (utilitariosService.possuiValor($scope.opcoes.fichaInscricao)) {
                            $scope.acao = $scope.opcoes.fichaInscricao.titulo;

                            if (utilitariosService.possuiValor($scope.opcoes.fichaInscricao.edital.faseCorrente)) {
                                if ($scope.opcoes.fichaInscricao.edital.faseCorrente.tipo.id === 5) {
                                    $scope.opcoes.faseAvaliacao = true;
                                } else if ($scope.opcoes.fichaInscricao.edital.faseCorrente.tipo.id === 6) {
                                    $scope.opcoes.faseRecursoAvaliacao = true;
                                } else if ($scope.opcoes.fichaInscricao.edital.faseCorrente.tipo.id === 7) {
                                    $scope.opcoes.faseRespostaRecursoAvaliacao = true;
                                }
                            } else {
                                $scope.opcoes.usuarioAdministrador = (conta.role === utilitariosService.roles.administrador);
                                $scope.opcoes.semFaseCorrenteUsuarioProponente = $scope.opcoes.usuarioProponente;
                            }
                        } else {
                            utilitariosService.operacaoNaoAutorizada("/inscricao");
                        }
                    });
                }

                $scope.cancele = function () {
                    $location.path("/inscricao");
                };

                $scope.opcoes.getNotaFinal = function () {
                    var notaFinal = 0;
                    var peso = 0;
                    var valor = 0;
                    var i;

                    $scope.opcoes.aprovado = "Não Classificado";

                    if (utilitariosService.possuiValor($scope.opcoes.fichaInscricao) && utilitariosService.possuiValor($scope.opcoes.fichaInscricao.avaliacao)) {
                        for (i = 0; i < $scope.opcoes.fichaInscricao.avaliacao.criteriosAvaliacao.length; i++) {
                            if (utilitariosService.possuiValor($scope.opcoes.fichaInscricao.avaliacao.criteriosAvaliacao[i].pontuacao)) {
                                peso = $scope.opcoes.fichaInscricao.avaliacao.criteriosAvaliacao[i].criterio.peso;
                                valor = $scope.opcoes.fichaInscricao.avaliacao.criteriosAvaliacao[i].pontuacao.valor;
                                notaFinal += +peso * +valor;
                            }
                        }

                        if (notaFinal >= $scope.opcoes.fichaInscricao.edital.mediaParaAprovacao) {
                            $scope.opcoes.aprovado = "Classificado";
                        }
                    }

                    return notaFinal;
                };

                $scope.opcoes.onChangePontuacaoCriterio = function (index, valor, nome) {
                    $scope.opcoes.fichaInscricao.avaliacao.criteriosAvaliacao[index].pontuacao.nome = nome;
                    $scope.opcoes.fichaInscricao.avaliacao.criteriosAvaliacao[index].pontuacao.valor = valor;
                };

                $rootScope.submitForm = function () {
                    $scope.opcoes.fichaInscricao.avaliacao.idFichaInscricao = $scope.opcoes.fichaInscricao.id;

                    if (!$scope.opcoes.usuarioAvaliador) {
                        if ($scope.opcoes.faseAvaliacao) {
                            apiService.put("fichaInscricao/AvaliarFichaInscricao", $scope.opcoes.fichaInscricao.avaliacao).then(function (response) {
                                $location.path("/inscricao");
                            });
                        } else if ($scope.opcoes.faseRecursoAvaliacao) {
                            apiService.put("fichaInscricao/RecursoAvaliacao", $scope.opcoes.fichaInscricao.avaliacao).then(function (response) {
                                $location.path("/inscricao");
                            });
                        } else if ($scope.opcoes.faseRespostaRecursoAvaliacao) {
                            apiService.put("fichaInscricao/RepostaRecursoAvalicao", $scope.opcoes.fichaInscricao.avaliacao).then(function (response) {
                                $location.path("/inscricao");
                            });
                        }
                    }
                };

                $rootScope.getAvaliacaoPDF = function () {
                    inscricaoService.getAvaliacaoPDF({ id: $routeParams.id });
                };
            }]);
})();