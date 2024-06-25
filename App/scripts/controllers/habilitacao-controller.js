(function () {
    "use strict";

    angular
        .module("fac")
        .controller("habilitacaoManutencaoController", ["$scope", "$rootScope", "$location", "$routeParams", "entidadeService", "apiService", "accountService", "utilitariosService", "inscricaoService",
            function ($scope, $rootScope, $location, $routeParams, entidadeService, apiService, accountService, utilitariosService, inscricaoService) {
                $scope.habilitacao = {};
                $scope.permiteManutencao = false;
                $scope.usuarioProponente = false;
                $scope.habilitacaoEnvio = {};
                $scope.respostaRecursoEnvio = {};
                $scope.recurso = {};
                $scope.acao = "";
                $scope.idFicha = $routeParams.id;
                $scope.desabilitarRespostaRecurso = true;

                var conta = accountService.getAccount();

                if (utilitariosService.possuiValor(conta)) {
                    if (conta.role === utilitariosService.roles.habilitador) {
                        inscricaoService.getHabilitacao({ idFicha: $routeParams.id }).then(function (response) {
                            $scope.habilitacao = response.data;

                            $scope.fichaFaseHabilitacao = $scope.habilitacao.fichaFaseHabilitacao;
                            $scope.fichaFaseRecursoHabilitacao = $scope.habilitacao.fichaFaseRecursoHabilitacao;
                            $scope.fichaFaseRespostaRecursoHabilitacao = $scope.habilitacao.fichaFaseRespostaRecursoHabilitacao;
                            $scope.permiteManutencao = $scope.fichaFaseHabilitacao || $scope.fichaFaseRecursoHabilitacao || $scope.fichaFaseRespostaRecursoHabilitacao;
                            if ($scope.permiteManutencao && $scope.fichaFaseRespostaRecursoHabilitacao) {
                                $scope.desabilitarRespostaRecurso = false;
                            } else {
                                $scope.desabilitarRespostaRecurso = true;
                            }
                            $scope.acao = $scope.habilitacao.tituloFichaInscricao;
                        });
                    } else if (conta.role === utilitariosService.roles.proponente) {
                        inscricaoService.getFichaInscricao({ id: $routeParams.id }).then(function (response) {
                            var ficha = response.data;
                            var fasesNaoAutorizadas = [1, 2, 4];
                            if (utilitariosService.possuiValor(ficha.fichaInscricao.edital.faseCorrente) &&
                                fasesNaoAutorizadas.indexOf(ficha.fichaInscricao.edital.faseCorrente.tipo.id) >= 0) {
                                utilitariosService.operacaoNaoAutorizada("/inscricao");
                            }
                            $scope.desabilitarRespostaRecurso = true;
                            $scope.usuarioProponente = true;

                            if (utilitariosService.possuiValor(ficha)) {
                                $scope.habilitacao.habilitacao = ficha.fichaInscricao.habilitacao;
                                $scope.habilitacao.tituloFichaInscricao = ficha.fichaInscricao.titulo;

                                $scope.fichaFaseHabilitacao = false;

                                if (utilitariosService.possuiValor(ficha.fichaInscricao.edital.faseCorrente)) {
                                    $scope.permiteManutencao = ficha.fichaInscricao.edital.faseCorrente.tipo.id === 3;
                                    //    $scope.fichaFaseRespostaRecursoHabilitacao = false;
                                } else {
                                    $scope.permiteManutencao = false;
                                }

                                //$scope.fichaFaseRespostaRecursoHabilitacao = false;
                                $scope.fichaFaseRecursoHabilitacao = true;
                                $scope.fichaFaseRespostaRecursoHabilitacao = true;

                                //$scope.permiteManutencao = $scope.fichaFaseRecursoHabilitacao;
                                $scope.acao = $scope.habilitacao.tituloFichaInscricao;
                            }
                        });
                    } else if (conta.role === utilitariosService.roles.administrador || conta.role === utilitariosService.roles.funcionariofac) {
                        inscricaoService.getHabilitacao({ idFicha: $routeParams.id }).then(function (response) {
                            $scope.habilitacao = response.data;

                            $scope.fichaFaseHabilitacao = true;
                            $scope.fichaFaseRecursoHabilitacao = true;
                            $scope.fichaFaseRespostaRecursoHabilitacao = true;
                            $scope.permiteManutencao = false;
                            $scope.usuarioProponente = true;
                            $scope.acao = "Visualização";
                        });
                    }
                }

                $rootScope.submitForm = function () {
                    if ($scope.fichaFaseHabilitacao) {
                        $scope.habilitacaoEnvio.id = $scope.idFicha;
                        $scope.habilitacaoEnvio.habilitado = $scope.habilitacao.habilitacao.habilitado;
                        $scope.habilitacaoEnvio.motivo = $scope.habilitacao.habilitacao.motivoInabilitacao;

                        apiService.put("fichaInscricao/Habilitacao", $scope.habilitacaoEnvio).then(function (response) {
                            $location.path("/inscricao");
                        });
                    } else if ($scope.fichaFaseRecursoHabilitacao) {
                        $scope.recurso.id = $scope.idFicha;
                        $scope.recurso.recurso = $scope.habilitacao.habilitacao.recurso;
                        apiService.put("fichaInscricao/HabilitacaoRecurso", $scope.recurso).then(function (response) {
                            $location.path("/inscricao");
                        });
                    } else if ($scope.fichaFaseRespostaRecursoHabilitacao) {
                        $scope.respostaRecursoEnvio.id = $scope.idFicha;
                        $scope.respostaRecursoEnvio.habilitado = $scope.habilitacao.habilitacao.habilitado;
                        $scope.respostaRecursoEnvio.resposta = $scope.habilitacao.habilitacao.respostaRecurso;
                        apiService.put("fichaInscricao/HabilitacaoRespostaRecurso", $scope.respostaRecursoEnvio).then(function (response) {
                            $location.path("/inscricao");
                        });
                    }
                };

                $rootScope.cancele = function () {
                    $location.path("/inscricao");
                };

                $rootScope.getHabilitacaoPDF = function () {
                    inscricaoService.getHabilitacaoPDF({ id: $routeParams.id });
                }
            }]);
})();