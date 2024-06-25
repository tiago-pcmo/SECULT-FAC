(function () {
    "use strict";

    angular
        .module("fac")
        .controller("inscricaoManutencaoController", ["$rootScope", "$scope", "$routeParams", "$location", "opcoes", "accountService", "entidadeService", "inscricaoService", "editalService", "notificacaoService", "utilitariosService", "moment", "$confirm", "proponenteService", "referenciaConfigService",
            function ($rootScope, $scope, $routeParams, $location, opcoes, accountService, entidadeService, inscricaoService, editalService, notificacaoService, utilitariosService, moment, $confirm, proponenteService, referenciaConfigService) {
                $scope.opcoes = opcoes;
                $scope.modoEdicao = $scope.opcoes.modoEdicao;
                $scope.acao = utilitariosService.obtenhaLabelAcao($scope.modoEdicao);
                $scope.segmentos = {};
                $scope.naturezas = {};
                $scope.opcoesAtividadesEstrategiasDeAcao = {};
                $scope.acoes = { editar: true };
                $scope.configuracoesRef = {};

                var conta = accountService.getAccount();

                $scope.opcoesFichaTecnicaEquipe = {
                    nomeArquivoCurriculo: "Currículo equipe",
                    nomeArquivoCartaDeAceite: "Carta de aceite equipe"
                };

                $scope.opcoesFichaTecnicaConvidados = {
                    nomeArquivoCurriculo: "Currículo convidado",
                    nomeArquivoCartaDeAceite: "Carta de aceite convidado"
                };

                $scope.opcoesQuadroResumo = {
                    onChangeTotalQuadroResumo: function (item) {
                        if (utilitariosService.possuiValor(item)) {
                            item.total = 0;
                            if (utilitariosService.possuiValor(item.quantidadeDistribuidaGratuitaSeduce)) {
                                item.total += +item.quantidadeDistribuidaGratuitaSeduce;
                            }

                            if (utilitariosService.possuiValor(item.quantidadeDistribuidaGratuitaOutros)) {
                                item.total += +item.quantidadeDistribuidaGratuitaOutros;
                            }

                            if (utilitariosService.possuiValor(item.quantidadeDisponivelVendaNormal)) {
                                item.total += +item.quantidadeDisponivelVendaNormal;
                            }

                            if (utilitariosService.possuiValor(item.quantidadeDisponivelVendaMeia)) {
                                item.total += +item.quantidadeDisponivelVendaMeia;
                            }

                            this.onChangeValorUnitarioQuadroResumo(item);
                        }
                    },
                    onChangeValorUnitarioQuadroResumo: function (item) {
                        if (utilitariosService.possuiValor(item)) {
                            item.receitaEstimadaVendaNormal = 0;
                            item.receitaEstimadaVendaMeia = 0;

                            if (utilitariosService.possuiValor(item.total) && utilitariosService.possuiValor(item.valorUnitario)) {
                                if (utilitariosService.possuiValor(item.quantidadeDisponivelVendaNormal)) {
                                    item.receitaEstimadaVendaNormal = +(+item.quantidadeDisponivelVendaNormal * +item.valorUnitario).toFixed(2);
                                }

                                if (utilitariosService.possuiValor(item.quantidadeDisponivelVendaMeia)) {
                                    item.receitaEstimadaVendaMeia = +(+item.quantidadeDisponivelVendaMeia * (+item.valorUnitario / 2)).toFixed(2);
                                }
                            }
                        }
                    }
                };

                $scope.opcoesQuadroResumoVisualizacao = {
                    totalEstimativaReceita: 0,
                    setTotalEstimativaReceita: function () {
                        var total = 0;

                        if (utilitariosService.possuiValor($scope.fichaInscricao.quadroResumoDistribuicaoComercializacao)) {
                            $scope.fichaInscricao.estimativaReceita = [];
                            for (var i = 0; i < $scope.fichaInscricao.quadroResumoDistribuicaoComercializacao.length; i++) {
                                var item = $scope.fichaInscricao.quadroResumoDistribuicaoComercializacao[i];
                                total += +(+item.receitaEstimadaVendaNormal + +item.receitaEstimadaVendaMeia).toFixed(2);
                                $scope.fichaInscricao.estimativaReceita.push({ produto: item.descricao, valor: +(+item.receitaEstimadaVendaNormal + +item.receitaEstimadaVendaMeia).toFixed(2) });
                            }
                        }

                        this.totalEstimativaReceita = +total.toFixed(2);
                    }
                };

                $scope.opcoesPlanilhaOrcamentaria = {
                    totais: {},
                    setTotalPorTipoPlanilhaOrcamentaria: function () {
                        this.totais.totalPreProducaoPreparacao = 0;
                        this.totais.totalProducaoExecucao = 0;
                        this.totais.totalDivulgacaoComercializacao = 0;
                        this.totais.totalCustosAdministrativos = 0;
                        this.totais.totalImpostosRecolhimento = 0;
                        this.totais.totalGeralPlanilha = 0;

                        if (utilitariosService.possuiValor($scope.fichaInscricao) && utilitariosService.possuiValor($scope.fichaInscricao.planilhaOrcamentaria)) {
                            for (var i = 0; i < $scope.fichaInscricao.planilhaOrcamentaria.length; i++) {
                                var item = $scope.fichaInscricao.planilhaOrcamentaria[i];

                                if (utilitariosService.possuiValor(item.total)) {
                                    if (item.tipo.id === 1) {
                                        this.totais.totalPreProducaoPreparacao += +item.total.toFixed(2);
                                    } else if (item.tipo.id === 2) {
                                        this.totais.totalProducaoExecucao += +item.total.toFixed(2);
                                    } else if (item.tipo.id === 3) {
                                        this.totais.totalDivulgacaoComercializacao += +item.total.toFixed(2);
                                    } else if (item.tipo.id === 4) {
                                        this.totais.totalCustosAdministrativos += +item.total.toFixed(2);
                                    } else if (item.tipo.id === 5) {
                                        this.totais.totalImpostosRecolhimento += +item.total.toFixed(2);
                                    }

                                    this.totais.totalGeralPlanilha += +item.total.toFixed(2);
                                }
                            }
                        }

                        this.totais.totalPreProducaoPreparacao = this.totais.totalPreProducaoPreparacao.toFixed(2);
                        this.totais.totalProducaoExecucao = this.totais.totalProducaoExecucao.toFixed(2);
                        this.totais.totalDivulgacaoComercializacao = this.totais.totalDivulgacaoComercializacao.toFixed(2);
                        this.totais.totalCustosAdministrativos = this.totais.totalCustosAdministrativos.toFixed(2);
                        this.totais.totalImpostosRecolhimento = this.totais.totalImpostosRecolhimento.toFixed(2);
                        this.totais.totalGeralPlanilha = this.totais.totalGeralPlanilha.toFixed(2);

                        this.setValorDiferencaPlanilhaParaPremio();
                    },
                    setValorDiferencaPlanilhaParaPremio: function () {
                        var valorDoPremio = utilitariosService.possuiValor($scope.fichaInscricao) && utilitariosService.possuiValor($scope.fichaInscricao.modulo) ? $scope.fichaInscricao.modulo.valor : 0;

                        this.totais.diferencaParaEdital = +(+valorDoPremio - +this.totais.totalGeralPlanilha).toFixed(2);
                        this.totais.diferencaParaEdital = numeral(this.totais.diferencaParaEdital).format("0,0.00");
                    },
                    onChangeItem: function (itemPlanilha) {
                        if (utilitariosService.possuiValor(itemPlanilha)) {
                            if (utilitariosService.possuiValor(itemPlanilha.quantidade) &&
                                utilitariosService.possuiValor(itemPlanilha.quantidadeUnidade) &&
                                utilitariosService.possuiValor(itemPlanilha.valorUnitario)) {
                                itemPlanilha.total = +((+itemPlanilha.quantidade * +itemPlanilha.quantidadeUnidade) * +itemPlanilha.valorUnitario).toFixed(2);
                            }
                        }
                    }
                };

                $scope.calculeTotalDeRecursos = function () {
                    if (angular.isUndefined($scope.fichaInscricao.recursoSolicitadoFundo) || $scope.fichaInscricao.recursoSolicitadoFundo === null) {
                        $scope.fichaInscricao.recursoSolicitadoFundo = 0;
                    }

                    if (angular.isUndefined($scope.fichaInscricao.percentualSolicitadoFundo)) {
                        $scope.fichaInscricao.percentualSolicitadoFundo = 0;
                    }

                    if (angular.isUndefined($scope.fichaInscricao.recursosOutrasFontes) || $scope.fichaInscricao.recursosOutrasFontes === null) {
                        $scope.fichaInscricao.recursosOutrasFontes = 0;
                    }

                    if (angular.isUndefined($scope.fichaInscricao.percentualOutrasFontes)) {
                        $scope.fichaInscricao.percentualOutrasFontes = 0;
                    }

                    if (+$scope.fichaInscricao.recursoSolicitadoFundo === 0 && +$scope.fichaInscricao.recursosOutrasFontes === 0) {
                        $scope.fichaInscricao.percentualSolicitadoFundo = 0;
                        $scope.fichaInscricao.percentualOutrasFontes = 0;
                    }

                    $scope.totalDeRecursosDoProjeto = +$scope.fichaInscricao.recursoSolicitadoFundo + +$scope.fichaInscricao.recursosOutrasFontes;

                    if (+$scope.totalDeRecursosDoProjeto > 0) {
                        $scope.fichaInscricao.percentualSolicitadoFundo = ((+$scope.fichaInscricao.recursoSolicitadoFundo / +$scope.totalDeRecursosDoProjeto) * 100).toFixed(2).replace(/[.,]00$/, "");
                        $scope.fichaInscricao.percentualOutrasFontes = ((+$scope.fichaInscricao.recursosOutrasFontes / +$scope.totalDeRecursosDoProjeto) * 100).toFixed(2).replace(/[.,]00$/, "");
                    }
                };

                $scope.inicializeWatches = function () {
                    $scope.$watchCollection(function () {
                        return $scope.fichaInscricao.naturezas;
                    }, function (naturezasAlteradas) {
                        $scope.projetoDeFormacao = false;

                        if (utilitariosService.possuiValor(naturezasAlteradas)) {
                            for (var i = 0; i < naturezasAlteradas.length; i++) {
                                var natureza = naturezasAlteradas[i];

                                if (natureza.formacao) {
                                    $scope.projetoDeFormacao = true;
                                    break;
                                }
                            }
                        }
                    });

                    $scope.$watch(function () {
                        return $scope.fichaInscricao.quadroResumoDistribuicaoComercializacao;
                    }, function () {
                        $scope.opcoesQuadroResumoVisualizacao.setTotalEstimativaReceita();
                    },
                        true);

                    $scope.$watch(function () {
                        return $scope.fichaInscricao.atividadesEstrategiasDeAcao;
                    }, function (atividadesAlteradas) {
                        if (utilitariosService.possuiValor(atividadesAlteradas)) {
                            var datasInicio = atividadesAlteradas.map(function (item) {
                                return item.dataInicio;
                            });

                            var datasFim = atividadesAlteradas.map(function (item) {
                                return item.dataFim;
                            });

                            datasInicio.sort(function (a, b) {
                                var dataA = utilitariosService.getIntDate(a);
                                var dataB = utilitariosService.getIntDate(b);

                                return dataA > dataB ? 1 : dataA < dataB ? -1 : 0;
                            });

                            datasFim.sort(function (a, b) {
                                var dataA = utilitariosService.getIntDate(a);
                                var dataB = utilitariosService.getIntDate(b);

                                return dataA < dataB ? 1 : dataA > dataB ? -1 : 0;
                            });

                            $scope.fichaInscricao.dataInicio = datasInicio[0];
                            $scope.fichaInscricao.dataFim = datasFim[0];
                        } else {
                            $scope.fichaInscricao.dataInicio = undefined;
                            $scope.fichaInscricao.dataFim = undefined;
                        }
                    },
                        true);

                    $scope.$watch(function () {
                        return $scope.fichaInscricao.planilhaOrcamentaria;
                    }, function () {
                        $scope.opcoesPlanilhaOrcamentaria.setTotalPorTipoPlanilhaOrcamentaria();
                    },
                        true);

                    $scope.$watch(function () {
                        return $scope.fichaInscricao.recursoSolicitadoFundo;
                    }, function () {
                        $scope.calculeTotalDeRecursos();
                    });

                    $scope.$watch(function () {
                        return $scope.fichaInscricao.recursosOutrasFontes;
                    }, function () {
                        $scope.calculeTotalDeRecursos();
                    });

                    $scope.$watch(function () {
                        return $scope.fichaInscricao.modulo;
                    }, function (novoModulo) {
                        if (!angular.isUndefined(novoModulo)) {
                            $scope.fichaInscricao.recursoSolicitadoFundo = +novoModulo.valor;
                        } else {
                            $scope.fichaInscricao.recursoSolicitadoFundo = 0;
                        }
                    });

                    $scope.$watch(function () {
                        return $scope.fichaInscricao.quadroResumoDistribuicaoComercializacao;
                    }, function () {
                        if (utilitariosService.possuiValor($scope.fichaInscricao.quadroResumoDistribuicaoComercializacao)) {
                            $scope.fichaInscricao.estimativaReceita = [];
                            for (var i = 0; i < $scope.fichaInscricao.quadroResumoDistribuicaoComercializacao.length; i++) {
                                var item = $scope.fichaInscricao.quadroResumoDistribuicaoComercializacao[i];

                                $scope.fichaInscricao.estimativaReceita.push({ produto: item.descricao, valor: item.receitaEstimadaVendaNormal + item.receitaEstimadaVendaMeia });
                            }
                        }
                    });
                };

                if (opcoes.modoEdicao) {
                    if (utilitariosService.possuiValor(conta)) {
                        inscricaoService.getFichaInscricao({ id: $routeParams.id }).then(function (response) {
                            var i = 0;
                            var fichaAcoes = response.data;

                            if (utilitariosService.possuiValor(fichaAcoes)) {
                                $scope.fichaInscricao = fichaAcoes.fichaInscricao;
                                $scope.acoes = fichaAcoes.acoes;
                                $scope.configuracoesRef = fichaAcoes.configuracoesReferencia;

                                if (utilitariosService.possuiValor($scope.fichaInscricao)) {
                                    // Executa os binds.
                                    $scope.editais = [$scope.fichaInscricao.edital];
                                    $scope.modalidades = $scope.fichaInscricao.edital.modalidades;
                                    $scope.modulos = $scope.fichaInscricao.modalidade.modulos;

                                    for (i = 0; i < $scope.fichaInscricao.segmentos.length; i++) {
                                        var segmentoCultural = $scope.fichaInscricao.segmentos[i];
                                        /*$scope.segmentos.push(segmentoCultural)//*/
                                        $scope.segmentos[segmentoCultural.id] = true;
                                        //$scope.segmentos[i] = true;
                                    }

                                    for (i = 0; i < $scope.fichaInscricao.naturezas.length; i++) {
                                        var naturezaDaProposta = $scope.fichaInscricao.naturezas[i];
                                        $scope.naturezas[naturezaDaProposta.id] = true;
                                    }

                                    $scope.opcoesQuadroResumoVisualizacao.setTotalEstimativaReceita();
                                    $scope.opcoesPlanilhaOrcamentaria.setTotalPorTipoPlanilhaOrcamentaria();
                                    $scope.onChangeRecursoOutrasFontes();

                                    $scope.inicializeWatches();
                                }
                            } else {
                                utilitariosService.operacaoNaoAutorizada("/inscricao");
                            }
                        });
                    }
                } else {
                    if (utilitariosService.possuiValor(conta)) {
                        editalService.getEditaisEmInscricao().then(function (response) {
                            $scope.editais = response.data;
                        });
                    }

                    editalService.getConfiguracoesReferenciaBase().then(function (response) {
                        $scope.configuracoesRef = response.data;
                    });

                    /* $scope.configuracoesRef = fichaAcoes.configuracoesReferencia;*/

                    $scope.fichaInscricao = {
                        proponenteProprietarioIntelectualProjeto: false,
                        proprietarioIntelecutalFuncionarioPublico: false,
                        proprietarioIntelectualParticipaOutrosProjetos: false
                    };

                    $scope.inicializeWatches();
                }

                if (utilitariosService.possuiValor(conta)) {
                    inscricaoService.getTiposLancamentoPlanilhaOrcamentaria().then(function (response) {
                        $scope.opcoesPlanilhaOrcamentaria.tiposLancamento = response.data;
                    });

                    inscricaoService.getSegmentosCulturais().then(function (response) {
                        $scope.segmentosCulturais = response.data;
                    });

                    inscricaoService.getNaturezasDaProposta().then(function (response) {
                        $scope.naturezasDaProposta = response.data;
                    });

                    inscricaoService.getTiposAtividadesEstrategiasDeAcao().then(function (response) {
                        $scope.opcoesAtividadesEstrategiasDeAcao.tiposAtividadesEstrategiasDeAcao = response.data;
                    });
                }

                $scope.opcoesFichaTecnicaEquipe.getCurriculo = function (id, downloadCallback) {
                    inscricaoService.getCurriculoFichaTecnicaEquipe({ id: id }).then(function (response) {
                        downloadCallback(response.data);
                    });
                };

                $scope.opcoesFichaTecnicaEquipe.getCarta = function (id, downloadCallback) {
                    inscricaoService.getCartaFichaTecnicaEquipe({ id: id }).then(function (response) {
                        downloadCallback(response.data);
                    });
                };

                $scope.opcoesFichaTecnicaConvidados.getCurriculo = function (id, downloadCallback) {
                    inscricaoService.getCurriculoFichaTecnicaConvidados({ id: id }).then(function (response) {
                        downloadCallback(response.data);
                    });
                };

                $scope.opcoesFichaTecnicaConvidados.getCarta = function (id, downloadCallback) {
                    inscricaoService.getCartaFichaTecnicaConvidados({ id: id }).then(function (response) {
                        downloadCallback(response.data);
                    });
                };

                $scope.onChangeEdital = function () {
                    $scope.modalidades = [];

                    if (utilitariosService.possuiValor($scope.fichaInscricao.edital)) {
                        $scope.modalidades = $scope.fichaInscricao.edital.modalidades;
                    }
                };

                $scope.onChangeModalidade = function () {
                    $scope.modulos = [];

                    if (utilitariosService.possuiValor($scope.fichaInscricao.modalidade)) {
                        $scope.modulos = $scope.fichaInscricao.modalidade.modulos;
                    }
                };

                $scope.onChangeSegmentosCulturais = function (segmento, marcado) {
                    if (!utilitariosService.possuiValor($scope.fichaInscricao.segmentos)) {
                        $scope.fichaInscricao.segmentos = [];
                    }
                    if ($scope.configuracoesRef.segmento.usarSegmentoPrincipal) {
                        if (marcado) {
                            $scope.fichaInscricao.segmentos.push(segmento);
                        } else {
                            for (var i = 0; i < $scope.fichaInscricao.segmentos.length; i++) {
                                var segmentoCultural = $scope.fichaInscricao.segmentos[i];

                                if (angular.equals(segmentoCultural, segmento)) {
                                    $scope.fichaInscricao.segmentos.splice(i, 1);
                                    break;
                                }
                            }
                        }
                    }
                };

                $scope.onChangeNaturezasDaProposta = function (natureza, marcada) {
                    if (!utilitariosService.possuiValor($scope.fichaInscricao.naturezas)) {
                        $scope.fichaInscricao.naturezas = [];
                    }

                    if (marcada) {
                        $scope.fichaInscricao.naturezas.push(natureza);
                    } else {
                        for (var i = 0; i < $scope.fichaInscricao.naturezas.length; i++) {
                            var naturezaDaProposta = $scope.fichaInscricao.naturezas[i];

                            if (angular.equals(naturezaDaProposta.id, natureza.id)) {
                                $scope.fichaInscricao.naturezas.splice(i, 1);
                                break;
                            }
                        }
                    }
                };

                $scope.getDeclaracaoProprietarioIntelectual = function (id, downloadCallback) {
                    inscricaoService.getDeclaracaoProprietarioIntelectual({ id: id }).then(function (response) {
                        downloadCallback(response.data);
                    });
                };

                $scope.getArquivoAnexoFichaInscricao = function (id, downloadCallback) {
                    inscricaoService.getArquivoAnexoFichaInscricao({ id: id }).then(function (response) {
                        downloadCallback(response.data);
                    });
                };

                $scope.onChangeProponenteProprietarioIntelectual = function () {
                    if ($scope.fichaInscricao.proponenteProprietarioIntelectualProjeto === false) {
                        if (angular.isUndefined($scope.fichaInscricao.proprietarioIntelecutalFuncionarioPublico) || $scope.fichaInscricao.proprietarioIntelecutalFuncionarioPublico === null) {
                            $scope.fichaInscricao.proprietarioIntelecutalFuncionarioPublico = false;
                        }

                        if (angular.isUndefined($scope.fichaInscricao.proprietarioIntelectualParticipaOutrosProjetos) || $scope.fichaInscricao.proprietarioIntelectualParticipaOutrosProjetos === null) {
                            $scope.fichaInscricao.proprietarioIntelectualParticipaOutrosProjetos = false;
                        }
                    }
                };

                $scope.getDeclaracaoProponente = function (id, downloadCallback) {
                    proponenteService.getDeclaracaoProponente({ id: id }).then(function (response) {
                        downloadCallback(response.data);
                    });
                };

                $scope.getDeclaracaoDirigente = function (id, downloadCallback) {
                    proponenteService.getDeclaracaoDirigente({ id: id }).then(function (response) {
                        downloadCallback(response.data);
                    });
                };

                $scope.onChangeRecursoOutrasFontes = function () {
                    $scope.valorOutrasFontesRequerido = utilitariosService.possuiValor($scope.fichaInscricao.recursosOutrasFontes) &&
                        +$scope.fichaInscricao.recursosOutrasFontes > 0 &&
                        (!utilitariosService.possuiValor($scope.fichaInscricao.detalhamentoPrevisaoRecursosOutrasFontes) ||
                            !utilitariosService.possuiValor($scope.fichaInscricao.detalhamentoPrevisaoRecursosOutrasFontes.recursosPropriosProponente) &&
                            !utilitariosService.possuiValor($scope.fichaInscricao.detalhamentoPrevisaoRecursosOutrasFontes.receitaPrevista) &&
                            !utilitariosService.possuiValor($scope.fichaInscricao.detalhamentoPrevisaoRecursosOutrasFontes.outraFonteApoiadora) &&
                            !utilitariosService.possuiValor($scope.fichaInscricao.detalhamentoPrevisaoRecursosOutrasFontes.valorOutraFonteApoiadora));

                    $scope.outraFonteApoiadoraRequerida = utilitariosService.possuiValor($scope.fichaInscricao.detalhamentoPrevisaoRecursosOutrasFontes) &&
                        ((!utilitariosService.possuiValor($scope.fichaInscricao.detalhamentoPrevisaoRecursosOutrasFontes.outraFonteApoiadora) &&
                            utilitariosService.possuiValor($scope.fichaInscricao.detalhamentoPrevisaoRecursosOutrasFontes.valorOutraFonteApoiadora)) ||
                            (utilitariosService.possuiValor($scope.fichaInscricao.detalhamentoPrevisaoRecursosOutrasFontes.outraFonteApoiadora) &&
                                !utilitariosService.possuiValor($scope.fichaInscricao.detalhamentoPrevisaoRecursosOutrasFontes.valorOutraFonteApoiadora)));
                };

                $scope.gerarPDF = function (aba) {
                    if (utilitariosService.possuiValor(aba)) {
                        inscricaoService.gerFichaInscricaoPdfAba({ id: $scope.fichaInscricao.id, aba: aba, nomeArquivo: aba });
                    }
                };

                $scope.salve = function (form) {
                    $rootScope.formPrincipalValid = true;

                    $scope.$broadcast("show-errors-check-validity", { form: form.$name });

                    if ($rootScope.formPrincipalValid === true) {
                        $confirm({}, { templateUrl: "App/views/inscricao/ModalConfirmSalvarFichaInscricao.html" })
                            .then(function () {
                                var opcoesService = { objeto: $scope.fichaInscricao };

                                if ($scope.modoEdicao) {
                                    inscricaoService.salvePut(opcoesService);
                                } else {
                                    inscricaoService.salvePost(opcoesService);
                                }
                            });
                    } else {
                        notificacaoService.showError(utilitariosService.msgVerifiqueInconsistencias);
                        utilitariosService.scrollToElement($("#inconsistencias"));
                    }
                };

                $rootScope.submitForm = function () {
                    $confirm({}, { templateUrl: "App/views/inscricao/ModalConfirmEnvioFichaInscricao.html" })
                        .then(function () {
                            $confirm({ text: "Tem certeza que deseja enviar sua ficha de inscrição?" })
                                .then(function () {
                                    var opcoesService = { entidade: opcoes.entidade, objeto: $scope.fichaInscricao, path: "/inscricao" };

                                    if ($scope.modoEdicao) {
                                        entidadeService.put(opcoesService);
                                    } else {
                                        entidadeService.post(opcoesService);
                                    }
                                });
                        });
                };

                $scope.cancele = function () {
                    $location.path("/inscricao");
                };
            }]);
})();