(function () {
    "use strict";

    angular
        .module("fac")
        .controller("documentacaoListagemController", ["$rootScope", "$scope", "$location", "$routeParams", "inscricaoService", "utilitariosService", "opcoes", "entidadeService", "documentacaoService",
            function ($rootScope, $scope, $location, $routeParams, inscricaoService, utilitariosService, opcoes, entidadeService, documentacaoService) {
                $scope.documentosListagem = [];

                documentacaoService.getList().then(function (response) {
                    $scope.documentosListagem = response.data;
                });

                //inscricaoService.getEditaisFichas().then(function (response) {

                //    debugger;
                //    var editaisFichas = response.data;
                //    $scope.opcoes.editais = editaisFichas.editais;
                //});

                $scope.nova = function () {
                    $location.path("/documentacao/novo");
                };

                $scope.exclua = function (id) {
                    entidadeService.del({ entidade: opcoes.entidade, id: id });
                };

                $scope.downloadDocumento = function (id, downloadCallback) {
                    documentacaoService.download({ id: id }).then(function (response) {
                        downloadCallback(response.data);
                    });
                };
            }])
        .controller("documentacaoAprovacaoController", ["$rootScope", "$scope", "$location", "$routeParams", "documentacaoService", "inscricaoService", "editalService", "utilitariosService", "opcoes", "entidadeService",
            function ($rootScope, $scope, $location, $routeParams, documentacaoService, inscricaoService, editalService, utilitariosService, opcoes, entidadeService) {
                $scope.opcoes = {};
                $scope.fichasParaAnalise = [];

                $scope.newFicha = function (codigo, titulo, edital, codigoEdital, codigoModalidade, documentos, avaliados, aprovados, reprovados) {
                    return {
                        codigo: codigo,
                        edital: edital,
                        codigoEdital: codigoEdital,
                        codigoModalidade: codigoModalidade,
                        titulo: titulo,
                        documentos: documentos,
                        avaliados: avaliados,
                        aprovados: aprovados,
                        reprovados: reprovados
                    }
                };

                $scope.avaliar = function () {
                    $location.path("/documentacaoFicha/novo");
                };

                editalService.getEditais().then(function (response) {
                    var editaisFichas = response.data;
                    $scope.opcoes.editais = editaisFichas;
                });

                $scope.limparFiltros = function () {
                    $scope.opcoes.editalSelecionado = null;
                    $scope.opcoes.modalidadeSelecionada = null;

                    $scope.carregarListaFiltrada();
                };

                inscricaoService.getDisponiveisParaAnaliseDocumentacao().then(function (response) {
                    if (response.data.length > 0) {
                        $scope.opcoes.listagemGeral = response.data.map(function (c) {
                            return $scope.newFicha(c.codigo, c.titulo, c.edital, c.codigoEdital, c.codigoModalidade, c.documentos, c.avaliados, c.aprovados, c.reprovados)
                        });

                        $scope.carregarListaFiltrada();
                    }
                });

                $scope.opcoes.onChangeEdital = function () {
                    $scope.popularModalidades();
                    $scope.carregarListaFiltrada();
                };

                $scope.popularModalidades = function () {
                    $scope.opcoes.modalidades = {};

                    if (utilitariosService.possuiValor($scope.opcoes.editalSelecionado)) {
                        $scope.opcoes.modalidades = $scope.opcoes.editalSelecionado.modalidades;
                    }
                };

                $scope.opcoes.onChangeModalidade = function () {
                    $scope.carregarListaFiltrada();
                };

                $scope.carregarListaFiltrada = function () {
                    $scope.fichasParaAnalise = [];

                    $scope.filtroPorEdital = false;
                    $scope.filtroPorModalidade = false;

                    if (utilitariosService.possuiValor($scope.opcoes.editalSelecionado)) {
                        if (utilitariosService.possuiValor($scope.opcoes.modalidadeSelecionada)) {
                            $scope.filtroPorModalidade = true;
                        }
                        else {
                            $scope.filtroPorEdital = true;
                        }
                    }

                    if (!$scope.filtroPorEdital && !$scope.filtroPorModalidade) {
                        $scope.fichasParaAnalise = $scope.opcoes.listagemGeral;
                    }
                    else {
                        for (var i = 0; i < $scope.opcoes.listagemGeral.length; i++) {
                            var ficha = $scope.opcoes.listagemGeral[i];

                            if ($scope.filtroPorEdital) {
                                if (ficha.codigoEdital === $scope.opcoes.editalSelecionado.id) {
                                    $scope.fichasParaAnalise.push(ficha);
                                }
                                continue;
                            }
                            else if ($scope.filtroPorModalidade) {
                                if (ficha.codigoEdital === $scope.opcoes.editalSelecionado.id &&
                                    ficha.codigoModalidade === $scope.opcoes.modalidadeSelecionada.id) {
                                    $scope.fichasParaAnalise.push(ficha);
                                }
                                continue;
                            }
                        }
                    }
                };
            }])
          .controller("documentacaoFichaController", ["$rootScope", "$scope", "$location", "$routeParams", "documentacaoService", "utilitariosService", "opcoes", "entidadeService",
            function ($rootScope, $scope, $location, $routeParams, documentacaoService, utilitariosService, opcoes, entidadeService) {
                $scope.documentosParaAprovacao = [];

                $scope.newFicha = function (id, nome, avaliado, aceito, observacao) {
                    return {
                        id: id,
                        nome: nome,
                        avaliado: avaliado,
                        aceito: aceito,
                        observacao: observacao
                    }
                };

                $scope.downloadDocumento = function (id, downloadCallback) {
                    documentacaoService.download({ id: id }).then(function (response) {
                        downloadCallback(response.data);
                    });
                };

                $scope.aceite = function (id, observacao) {
                    documentacaoService.aceite({ id: id, observacao: observacao }).then(function (response) {
                        $scope.getDocumentosAprovacao();
                    });
                };

                $scope.recuse = function (id, observacao) {
                    documentacaoService.recuse({ id: id, observacao: observacao }).then(function (response) {
                        $scope.getDocumentosAprovacao();
                    });
                };

                $scope.getDocumentosAprovacao = function () {
                    documentacaoService.getDocumentosAprovacao({ id: $routeParams.id }).then(function (response) {
                        if (response.data.length > 0) {
                            $scope.documentosParaAprovacao = response.data.map(function (c) {
                                return $scope.newFicha(c.id, c.nome, c.avaliado, c.aceito, c.motivoRecusa)
                            });
                        }
                    });
                };

                $scope.getDocumentosAprovacao();

            }])
        .controller("documentacaoManutencaoController", ["$rootScope", "$scope", "$location", "opcoes", "$routeParams", "documentacaoService", "utilitariosService", "accountService", "inscricaoService", "notificacaoService", "entidadeService", "tipoDocumentoService",
            function ($rootScope, $scope, $location, opcoes, $routeParams, documentacaoService, utilitariosService, accountService, inscricaoService, notificacaoService, entidadeService, tipoDocumentoService) {
                $scope.acao = utilitariosService.obtenhaLabelAcao(opcoes.modoEdicao);
                $scope.checkAll = false;
                $scope.fichasParaVinculo = [];
                $scope.tiposDocumentos = {};

                $scope.newFicha = function (codigo, titulo, marcado) { return { codigo: codigo, titulo: titulo, marcado: marcado } };

                $scope.validate = function () {
                    var msgRetorno = [];
                    if (!$scope.formPrincipal.$valid) {
                        msgRetorno.push({ message: "O tipo do documento é obrigatório" });
                    }

                    var possuiMarcados = $scope.fichasParaVinculo.filter(function (f) { return f.marcado === true });
                    if (possuiMarcados.length === 0) {
                        msgRetorno.push({ message: "Ao menos 1 (uma) ficha deve ser marcada em Vincular a" });
                    }

                    var possuiTamanho = utilitariosService.possuiValor($scope.documento) && utilitariosService.possuiValor($scope.documento.tamanho);
                    if (!possuiTamanho) {
                        msgRetorno.push({ message: "O documento deve ser informado no formato de PDF" });
                    }

                    if (possuiTamanho && $scope.documento.tamanho > 20) {
                        msgRetorno.push({ message: "O documento deve ter no máximo 20MB" });
                    }

                    return msgRetorno;
                };

                $scope.checkAllClick = function () {
                    if ($scope.fichasParaVinculo.length > 0) {
                        $scope.fichasParaVinculo = $scope.fichasParaVinculo.map(function (c) { return $scope.newFicha(c.codigo, c.titulo, $scope.checkAll) });
                    }
                };

                inscricaoService.getDisponiveisParaEnvioDocumentacao().then(function (response) {
                    if (response.data.length > 0) {
                        $scope.fichasParaVinculo = response.data.map(function (c) { return $scope.newFicha(c.codigo, c.titulo, false) });
                    }
                });

                tipoDocumentoService.getLista().then(function (response) {
                    $scope.tiposDocumentos = response.data;
                });

                if (opcoes.modoEdicao) {
                    documentacaoService.get({ id: $routeParams.id }).then(function (response) {
                        $scope.documento = response.data;
                        $scope.inicializeItensEdicao();
                    });
                }

                $scope.inicializeItensEdicao = function () {
                    if (utilitariosService.possuiValor($scope.documento)) {
                        if (utilitariosService.possuiValor($scope.documento.fichasVinculadas) && $scope.documento.fichasVinculadas.length > 0) {
                            var fichasParaVinculo = $scope.fichasParaVinculo;
                            $scope.fichasParaVinculo = $scope.fichasParaVinculo.map(function (f) {
                                var marcado = $scope.documento.fichasVinculadas.find(function (e) { return e.id == f.codigo });
                                f.marcado = marcado !== null && marcado !== undefined;
                                return f;
                            });
                        }
                    }
                };

                $scope.downloadDocumento = function (id, downloadCallback) {
                    documentacaoService.download({ id: id }).then(function (response) {
                        downloadCallback(response.data);
                    });
                };

                $scope.salve = function () {
                    var msgValidacao = $scope.validate();
                    if (msgValidacao.length > 0) {
                        $rootScope.errosDeValidacao = msgValidacao;
                        utilitariosService.scrollToElement($("#inconsistencias"));
                        return;
                    }

                    $scope.documento.fichasVinculadas = $scope.fichasParaVinculo.map(function (f) { if (f.marcado === true) { return { id: f.codigo, titulo: f.titulo } } });

                    if (opcoes.modoEdicao) {
                        documentacaoService.salvePut({ objeto: $scope.documento });
                        return;
                    }

                    documentacaoService.salvePost({ objeto: $scope.documento });
                };

                if (opcoes.modoEdicao) {
                    documentacaoService.get({ id: $routeParams.id }).then(function (response) {
                        $scope.documento = response.data;
                    });
                }

            }]);
})();