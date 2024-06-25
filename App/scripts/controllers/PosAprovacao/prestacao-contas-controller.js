(function () {
    "use strict";

    angular
        .module("fac")
        .controller("prestacaoContasListagemController", ["$rootScope", "$scope", "$location", "$routeParams", "prestacaoContasService", "inscricaoService", "utilitariosService", "opcoes", "entidadeService",
            function ($rootScope, $scope, $location, $routeParams, prestacaoContasService, inscricaoService, utilitariosService, opcoes, entidadeService) {
                $scope.lista = [];

                prestacaoContasService.getList().then(function (response) {
                    $scope.lista = response.data;
                });

                $scope.nova = function () {
                    $location.path("/prestacaoContas/novo");
                };

                $scope.exclua = function (id) {
                    debugger;
                    entidadeService.del({ entidade: opcoes.entidade, id: id });
                };

                $scope.downloadDocumento = function (id, downloadCallback) {
                    prestacaoContasService.download({ id: id }).then(function (response) {
                        downloadCallback(response.data);
                    });
                };
            }])
        .controller("prestacaoContasAprovacaoController", ["$rootScope", "$scope", "$location", "$routeParams", "prestacaoContasService", "inscricaoService", "editalService", "utilitariosService", "opcoes", "entidadeService",
            function ($rootScope, $scope, $location, $routeParams, prestacaoContasService, inscricaoService, editalService, utilitariosService, opcoes, entidadeService) {
                $scope.opcoes = {};
                $scope.fichasParaAnalise = [];

                debugger;

                $scope.newFicha = function (codigo, titulo, edital, codigoEdital, codigoModalidade, documentos, avaliados, aprovados, reprovados, extensao, mimeType, nomeCompleto) {
                    return {
                        codigo: codigo,
                        edital: edital,
                        codigoEdital: codigoEdital,
                        codigoModalidade: codigoModalidade,
                        titulo: titulo,
                        documentos: documentos,
                        avaliados: avaliados,
                        aprovados: aprovados,
                        reprovados: reprovados,
                        extensao: extensao,
                        mimeType: mimeType,
                        nomeCompleto: nomeCompleto,
                    }
                };

                $scope.avaliar = function () {
                    $location.path("/prestacaoContasFicha/novo");
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

                inscricaoService.getDisponiveisParaAnalisePrestacaoContas().then(function (response) {
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
          .controller("prestacaoContasFichaController", ["$rootScope", "$scope", "$location", "$routeParams", "prestacaoContasService", "utilitariosService", "opcoes", "entidadeService",
            function ($rootScope, $scope, $location, $routeParams, prestacaoContasService, utilitariosService, opcoes, entidadeService) {
                $scope.documentosParaAprovacao = [];

                debugger;
                $scope.newFicha = function (id, dataDeCriacao, nome, avaliado, aceito, observacao, solicitacao, titulo, tamanho, extensao, mimeType, nomeCompleto) {
                    return {
                        id: id,
                        dataDeCriacao: dataDeCriacao,
                        nome: nome,
                        avaliado: avaliado,
                        aceito: aceito,
                        observacao: observacao,
                        solicitacao: solicitacao,
                        titulo: titulo,
                        tamanho: tamanho,
                        extensao: extensao,
                        mimeType: mimeType,
                        nomeCompleto: nomeCompleto,
                    }
                };

                $scope.downloadDocumento = function (id, downloadCallback) {
                    prestacaoContasService.download({ id: id }).then(function (response) {
                        downloadCallback(response.data);
                    });
                };

                $scope.aceite = function (id, observacao) {
                    prestacaoContasService.aceite({ id: id, observacao: observacao }).then(function (response) {
                        $scope.getPrestacaoContasAprovacao();
                    });
                };

                $scope.recuse = function (id, observacao) {
                    debugger;
                    prestacaoContasService.recuse({ id: id, observacao: observacao }).then(function (response) {
                        $scope.getPrestacaoContasAprovacao();
                    });
                };

                $scope.getPrestacaoContasAprovacao = function () {
                    prestacaoContasService.getPrestacaoContasAprovacao({ id: $routeParams.id }).then(function (response) {
                        if (response.data.length > 0) {
                            $scope.documentosParaAprovacao = response.data.map(function (c) {
                                var dataCriacao = new Date(c.dataDeCriacao)
                                var dataFormatada = dataCriacao.getDay() + "/" + dataCriacao.getMonth() + "/" + dataCriacao.getFullYear() + " " +
                                    dataCriacao.getHours() + ":" + dataCriacao.getMinutes()
                                return $scope.newFicha(c.id, dataFormatada, c.nome, c.avaliado, c.aceito, c.motivoRecusa, c.solicitacao, c.titulo, c.tamanho, c.extensao, c.mimeType, c.nomeCompleto)
                            });
                        }
                    });
                };

                $scope.getPrestacaoContasAprovacao();

            }])
        .controller("prestacaoContasManutencaoController", ["$rootScope", "$scope", "$location", "opcoes", "$routeParams", "prestacaoContasService", "utilitariosService", "accountService", "inscricaoService", "notificacaoService", "entidadeService", "tipoDocumentoService",
            function ($rootScope, $scope, $location, opcoes, $routeParams, prestacaoContasService, utilitariosService, accountService, inscricaoService, notificacaoService, entidadeService, tipoDocumentoService) {
                $scope.acao = utilitariosService.obtenhaLabelAcao(opcoes.modoEdicao);
                $scope.checkAll = false;
                $scope.fichasParaVinculo = [];
                $scope.tiposAlteracao = {};

                debugger;

                $scope.newFicha = function (codigo, titulo, marcado) { return { codigo: codigo, titulo: titulo, marcado: marcado } };

                $scope.validate = function () {
                    var msgRetorno = [];
                    ////if (!$scope.formPrincipal.$valid) {
                    ////    msgRetorno.push({ message: "O tipo do documento é obrigatório" });
                    ////}

                    var possuiMarcados = $scope.fichasParaVinculo.filter(function (f) { return f.marcado === true });
                    if (possuiMarcados.length === 0) {
                        msgRetorno.push({ message: "1 (uma) ficha deve ser marcada em Vincular a" });
                    }

                    var possuiTamanho = utilitariosService.possuiValor($scope.documento) && utilitariosService.possuiValor($scope.documento.tamanho);
                    ////if (!possuiTamanho) {
                    ////    msgRetorno.push({ message: "O documento deve ser informado no formato de PDF" });
                    ////}

                    var possuiSolicitacao = utilitariosService.possuiValor($scope.documento) && utilitariosService.possuiValor($scope.documento.solicitacao);
                    if (!possuiSolicitacao) {
                        msgRetorno.push({ message: "A solicitação é obrigatória" });
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

                $scope.handleRadioClick = function (objeto) {
                    angular.forEach($scope.fichasParaVinculo, function (value, key) {
                        value.marcado = (value.codigo === objeto.codigo);
                    });
                };

                inscricaoService.getDisponiveisParaEnvioDocumentacao().then(function (response) {
                    if (response.data.length > 0) {
                        $scope.fichasParaVinculo = response.data.map(function (c) { return $scope.newFicha(c.codigo, c.titulo, false) });
                    }
                });

                //prestacaoContasService.getTipos().then(function (response) {
                //    $scope.tiposAlteracao = response.data;
                //});

                if (opcoes.modoEdicao) {
                    prestacaoContasService.get({ id: $routeParams.id }).then(function (response) {
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
                    prestacaoContasService.download({ id: id }).then(function (response) {
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
                    debugger;
                    if (opcoes.modoEdicao) {
                        prestacaoContasService.salvePut({ objeto: $scope.documento });
                        return;
                    }

                    prestacaoContasService.salvePost({ objeto: $scope.documento });
                };

                if (opcoes.modoEdicao) {
                    prestacaoContasService.get({ id: $routeParams.id }).then(function (response) {
                        $scope.documento = response.data;
                    });
                }

            }]);
})();