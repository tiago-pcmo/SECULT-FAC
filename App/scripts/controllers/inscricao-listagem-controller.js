(function () {
    "use strict";

    angular
        .module("fac")
        .controller("inscricaoListagemController", ["$scope", "$location", "accountService", "entidadeService", "utilitariosService", "proponenteService", "opcoes", "inscricaoService",
            function ($scope, $location, accountService, entidadeService, utilitariosService, proponenteService, opcoes, inscricaoService) {
                $scope.opcoes = {};
                $scope.acao = "";
                $scope.colunasPorTipoUsuario = 10;
                $scope.exibirAcoesPosAprovacao = false;

                var conta = accountService.getAccount();

                if (utilitariosService.possuiValor(conta)) {
                    inscricaoService.getEditaisFichas().then(function (response) {
                        var editaisFichas = response.data;
                        $scope.opcoes.editais = editaisFichas.editais;
                        $scope.opcoes.fichasInscricaoGeral = editaisFichas.fichasInscricaoAcoes;
                        $scope.editalEmInscricao = editaisFichas.possuiEditalEmFaseInscricao;
                        $scope.exibirAcoesPosAprovacao = editaisFichas.permissoesAcoesPosAprovacao != null;
                        $scope.opcoes.acoesPosAprovacao = editaisFichas.permissoesAcoesPosAprovacao;
                        debugger;
                        switch (conta.role) {
                            case utilitariosService.roles.administrador:
                                $scope.exibirFiltros = true;
                                break;

                            case utilitariosService.roles.funcionariofac:
                                $scope.exibirFiltros = true;                               
                                break;

                            case utilitariosService.roles.proponente:
                                $scope.opcoes.fichasInscricao = $scope.opcoes.fichasInscricaoGeral;
                                $scope.usuarioProponente = true;
                                break;

                            case utilitariosService.roles.habilitador:
                                $scope.acao = "- para habilitação";
                                $scope.usuarioHabilitador = true;
                                $scope.colunasPorTipoUsuario = 8;
                                $scope.exibirFiltros = true;
                                break;

                            case utilitariosService.roles.parecerista:
                            case utilitariosService.roles.conselheiro:
                                $scope.opcoes.fichasInscricao = $scope.opcoes.fichasInscricaoGeral;
                                $scope.acao = "- para avaliação";
                                $scope.exibirFiltros = true;
                                break;
                        }
                    });
                }

                $scope.nova = function () {
                    $location.path("/inscricao/nova");
                };

                $scope.carregarListaFichasAdmin = function (idEditalSelecionado) {
                    inscricaoService.getEditaisFichasPerfilAdmin({ id: idEditalSelecionado }).then(function (response) {
                        var editaisFichas = response.data;
                        $scope.opcoes.fichasInscricaoGeral = editaisFichas.fichasInscricaoAcoes;
                        $scope.editalEmInscricao = editaisFichas.possuiEditalEmFaseInscricao;
                        $scope.exibirFiltros = true;
                        $scope.popularFichas();
                    });
                };

                $scope.popularFichas = function () {
                    $scope.opcoes.modalidades = {};
                    $scope.opcoes.modulos = {};
                    $scope.modalidadeSelecionada = "";

                    if (utilitariosService.possuiValor($scope.opcoes.editalSelecionado)) {
                        $scope.opcoes.modalidades = $scope.opcoes.editalSelecionado.modalidades;
                    } else {
                        $scope.opcoes.fichasInscricao = $scope.opcoes.fichasInscricaoGeral;
                    }

                    $scope.carregarListaFiltrada();
                };

                $scope.opcoes.onChangeEdital = function () {
                    if (conta.role !== utilitariosService.roles.administrador
                        && conta.role !== utilitariosService.roles.funcionariofac) {
                        $scope.popularFichas();
                        return;
                    }

                    var id = -1;
                    if (utilitariosService.possuiValor($scope.opcoes.editalSelecionado)) {
                        id = $scope.opcoes.editalSelecionado.id;
                    }

                    $scope.carregarListaFichasAdmin(id);
                };

                $scope.opcoes.onChangeModalidade = function () {
                    $scope.opcoes.modulos = {};
                    if (utilitariosService.possuiValor($scope.opcoes.modalidadeSelecionada)) {
                        $scope.opcoes.modulos = $scope.opcoes.modalidadeSelecionada.modulos;
                    }

                    $scope.carregarListaFiltrada();
                };

                $scope.opcoes.onchangeModulo = function () {
                    $scope.carregarListaFiltrada();
                };

                $scope.carregarListaFiltrada = function () {
                    $scope.opcoes.fichasInscricao = [];
                    debugger;
                    if (!utilitariosService.possuiValor($scope.opcoes.editalSelecionado) &&
                        !utilitariosService.possuiValor($scope.opcoes.modalidadeSelecionada) &&
                        !utilitariosService.possuiValor($scope.opcoes.moduloSelecionado)) {
                        if (!(utilitariosService.possuiValor(conta) && (conta.role === utilitariosService.roles.habilitador
                            || conta.role === utilitariosService.roles.administrador
                            || conta.role === utilitariosService.roles.funcionariofac))) {
                            $scope.opcoes.fichasInscricao = $scope.opcoes.fichasInscricaoGeral;
                        }

                        return;
                    }

                    $scope.filtroTodos = false;
                    $scope.filtroPorEdital = true;
                    $scope.filtroPorModalidade = false;

                    if (utilitariosService.possuiValor($scope.opcoes.editalSelecionado)) {
                        if (utilitariosService.possuiValor($scope.opcoes.modalidadeSelecionada)) {
                            if (utilitariosService.possuiValor($scope.opcoes.moduloSelecionado)) {
                                $scope.filtroTodos = true;
                            } else {
                                $scope.filtroPorModalidade = true;
                            }

                            $scope.filtroPorEdital = false;
                        }
                    }

                    for (var i = 0; i < $scope.opcoes.fichasInscricaoGeral.length; i++) {
                        var ficha = $scope.opcoes.fichasInscricaoGeral[i];

                        if ($scope.filtroPorEdital) {
                            if (ficha.fichaInscricao.edital.id === $scope.opcoes.editalSelecionado.id) {
                                $scope.opcoes.fichasInscricao.push(ficha);
                            }
                            continue;
                        }

                        if ($scope.filtroPorModalidade) {
                            if (ficha.fichaInscricao.edital.id === $scope.opcoes.editalSelecionado.id &&
                                ficha.fichaInscricao.modalidade.id === $scope.opcoes.modalidadeSelecionada.id) {
                                $scope.opcoes.fichasInscricao.push(ficha);
                            }
                            continue;
                        }

                        if ($scope.filtroTodos) {
                            if (ficha.fichaInscricao.edital.id === $scope.opcoes.editalSelecionado.id &&
                                ficha.fichaInscricao.modalidade.id === $scope.opcoes.modalidadeSelecionada.id &&
                                ficha.fichaInscricao.modulo.id === $scope.opcoes.moduloSelecionado.id) {
                                $scope.opcoes.fichasInscricao.push(ficha);
                            }
                            continue;
                        }
                    }
                };

                $scope.getFichaInscricaoPdf = function (idFichaInscricao, nomeArquivo) {
                    inscricaoService.getFichaInscricaoPdf({ id: idFichaInscricao, nomeArquivo: nomeArquivo });
                };

                $scope.exclua = function (id) {
                    entidadeService.del({ entidade: opcoes.entidade, id: id });
                };

                $scope.limparFiltros = function (editalSelecionado) {
                    $scope.opcoes.modalidades = {};
                    $scope.opcoes.modulos = {};
                    $scope.modalidadeSelecionada = "";
                    $scope.opcoes.editalSelecionado = "";
                    $scope.carregarListaFiltrada();
                };

                $scope.obterSituacaoAprov = function (classificacao) {
                    switch (+classificacao) {
                        case 1:
                            return "Aprovado";
                        case 2:
                            return "Suplente";
                        default:
                            return "Não Aprovado";
                    }
                };
            }]);
})();