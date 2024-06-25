(function () {
    'use strict';

    angular
        .module("fac")
        .factory("inscricaoService", ["$location", "apiService", "notificacaoService", "utilitariosService",
            function ($location, apiService, notificacaoService, utilitariosService) {
                var salvePost = function (options) {
                    var promise = apiService.post("fichaInscricao/salve", options.objeto);

                    promise.then(function () {
                        notificacaoService.showSuccess("Inscrição salva com sucesso.");
                        $location.path(angular.isUndefined(options.path) ? "/inscricao" : options.path);
                    });

                    return promise;
                };

                var salvePut = function (options) {
                    var promise = apiService.put("fichaInscricao/salve", options.objeto);

                    promise.then(function () {
                        notificacaoService.showSuccess("Inscrição salva com sucesso.");
                        $location.path(angular.isUndefined(options.path) ? "/inscricao" : options.path);
                    });

                    return promise;
                };

                var getFichaInscricao = function (options) {
                    return apiService.get("fichaInscricao/GetFichaInscricao/" + options.id);
                };

                var getTiposLancamentoPlanilhaOrcamentaria = function () {
                    return apiService.get("fichaInscricao/GetTiposLancamentoPlanilhaOrcamentaria");
                };

                var getSegmentosCulturais = function () {
                    return apiService.get("fichaInscricao/GetSegmentosCulturais");
                };

                var getNaturezasDaProposta = function () {
                    return apiService.get("fichaInscricao/GetNaturezasDaProposta");
                };

                var getCurriculoFichaTecnicaEquipe = function (options) {
                    return apiService.post("fichaInscricao/GetCurriculoFichaTecnicaEquipe/" + options.id);
                };

                var getCartaFichaTecnicaEquipe = function (options) {
                    return apiService.post("fichaInscricao/GetCartaFichaTecnicaEquipe/" + options.id);
                };

                var getCurriculoFichaTecnicaConvidados = function (options) {
                    return apiService.post("fichaInscricao/GetCurriculoFichaTecnicaConvidados/" + options.id);
                };

                var getCartaFichaTecnicaConvidados = function (options) {
                    return apiService.post("fichaInscricao/GetCartaFichaTecnicaConvidados/" + options.id);
                };

                var getTiposAtividadesEstrategiasDeAcao = function () {
                    return apiService.get("fichaInscricao/GetTiposAtividadesEstrategiasDeAcao");
                };

                var getHabilitacao = function (options) {
                    return apiService.get("fichaInscricao/GetHabilitacao/" + options.idFicha);
                };

                var getFichaInscricaoParaAvaliacao = function (options) {
                    return apiService.get("fichaInscricao/GetFichaInscricaoParaAvaliacao/" + options.id);
                };

                var getEditaisFichas = function () {
                    debugger;
                    return apiService.get("fichaInscricao/GetEditaisFichas");
                };

                var getDeclaracaoProprietarioIntelectual = function (options) {
                    return apiService.post("fichaInscricao/GetDeclaracaoProprietarioIntelectual/" + options.id);
                };

                var getArquivoAnexoFichaInscricao = function (options) {
                    return apiService.post("fichaInscricao/GetArquivoAnexoFichaInscricao/" + options.id);
                };

                var getFichaInscricaoPdf = function (options) {
                    return apiService.post("fichaInscricao/GetFichaInscricaoPdf/" + options.id).then(function (response) {
                        var base64BinaryString = response.data;

                        if (utilitariosService.possuiValor(base64BinaryString)) {
                            var arrayBuffer = utilitariosService.base64ToArrayBuffer(base64BinaryString);
                            var blob = new Blob([arrayBuffer], { type: "application/pdf" });

                            if (options.nomeArquivo.indexOf(".pdf") < 0) {
                                options.nomeArquivo += ".pdf";
                            }

                            saveAs(blob, options.nomeArquivo);
                        }
                    });
                };

                var gerFichaInscricaoPdfAba = function (options) {
                    return apiService.post("fichaInscricao/GetFichaInscricaoPdfAba/" + options.id + "/" + options.aba).then(function (response) {
                        var base64BinaryString = response.data;

                        if (utilitariosService.possuiValor(base64BinaryString)) {
                            var arrayBuffer = utilitariosService.base64ToArrayBuffer(base64BinaryString);
                            var blob = new Blob([arrayBuffer], { type: "application/pdf" });

                            if (options.nomeArquivo.indexOf(".pdf") < 0) {
                                options.nomeArquivo += ".pdf";
                            }
                            saveAs(blob, options.nomeArquivo);
                        }
                    });
                };

                var getHabilitacaoPDF = function (options) {
                    return apiService.post("fichaInscricao/GetHabilitacaoPDF/" + options.id).then(function (response) {
                        var base64BinaryString = response.data;

                        if (utilitariosService.possuiValor(base64BinaryString)) {
                            var arrayBuffer = utilitariosService.base64ToArrayBuffer(base64BinaryString);
                            var blob = new Blob([arrayBuffer], { type: "application/pdf" });
                            saveAs(blob, "Habilitacao.pdf");
                        }
                    });
                };

                var getAvaliacaoPDF = function (options) {
                    return apiService.post("fichaInscricao/GetAvaliacaoPDF/" + options.id).then(function (response) {
                        var base64BinaryString = response.data;

                        if (utilitariosService.possuiValor(base64BinaryString)) {
                            var arrayBuffer = utilitariosService.base64ToArrayBuffer(base64BinaryString);
                            var blob = new Blob([arrayBuffer], { type: "application/pdf" });
                            saveAs(blob, "Avaliacao.pdf");
                        }
                    });
                };

                var classificarFicha = function (options) {
                    apiService.put("fichaInscricao/ClassificarFicha/" + options.id + "/" + options.classificacao).then(function (response) {
                        notificacaoService.showSuccess("Situação da Classificação atualizada.");
                        $location.path("/inscricao");
                    });
                };

                var getEditaisFichasPerfilAdmin = function (options) {
                    debugger;
                    return apiService.get("fichaInscricao/GetEditaisFichasPerfilAdmin/" + options.id);
                };

                var getDisponiveisParaEnvioDocumentacao = function () {
                    return apiService.get("fichaInscricao/GetDisponiveisParaEnvioDocumentacao");
                };

                var getDisponiveisParaAnaliseDocumentacao = function () {
                    return apiService.get("fichaInscricao/GetDisponiveisParaAnaliseDocumentacao");
                };

                var getDisponiveisParaAnaliseLogo = function () {
                    return apiService.get("fichaInscricao/GetDisponiveisParaAnaliseLogo");
                };

                var getDisponiveisParaAnaliseAlteracao = function () {
                    return apiService.get("fichaInscricao/GetDisponiveisParaAnaliseAlteracao");
                };

                var getFichasParaPareceristas = function () {
                    return apiService.get("fichaInscricao/GetFichasParaPareceristas");
                };

                var getDisponiveisParaAnaliseFormularioTrimestral = function () {
                    return apiService.get("fichaInscricao/GetDisponiveisParaAnaliseFormularioTrimestral");
                };

                var getDisponiveisParaAnaliseCatalogacao = function () {
                    return apiService.get("fichaInscricao/GetDisponiveisParaAnaliseCatalogacao ");
                };

                var getDisponiveisParaAnalisePrestacaoContas = function () {
                    return apiService.get("fichaInscricao/GetDisponiveisParaAnalisePrestacaoContas");
                };

                return {
                    salvePost: salvePost,
                    salvePut: salvePut,
                    getFichaInscricao: getFichaInscricao,
                    getTiposLancamentoPlanilhaOrcamentaria: getTiposLancamentoPlanilhaOrcamentaria,
                    getSegmentosCulturais: getSegmentosCulturais,
                    getNaturezasDaProposta: getNaturezasDaProposta,
                    getCurriculoFichaTecnicaEquipe: getCurriculoFichaTecnicaEquipe,
                    getCartaFichaTecnicaEquipe: getCartaFichaTecnicaEquipe,
                    getCurriculoFichaTecnicaConvidados: getCurriculoFichaTecnicaConvidados,
                    getCartaFichaTecnicaConvidados: getCartaFichaTecnicaConvidados,
                    getTiposAtividadesEstrategiasDeAcao: getTiposAtividadesEstrategiasDeAcao,
                    getHabilitacao: getHabilitacao,
                    getFichaInscricaoParaAvaliacao: getFichaInscricaoParaAvaliacao,
                    getEditaisFichas: getEditaisFichas,
                    getDeclaracaoProprietarioIntelectual: getDeclaracaoProprietarioIntelectual,
                    getArquivoAnexoFichaInscricao: getArquivoAnexoFichaInscricao,
                    getFichaInscricaoPdf: getFichaInscricaoPdf,
                    classificarFicha: classificarFicha,
                    gerFichaInscricaoPdfAba: gerFichaInscricaoPdfAba,
                    getHabilitacaoPDF: getHabilitacaoPDF,
                    getAvaliacaoPDF: getAvaliacaoPDF,
                    getEditaisFichasPerfilAdmin: getEditaisFichasPerfilAdmin,
                    getDisponiveisParaEnvioDocumentacao: getDisponiveisParaEnvioDocumentacao,
                    getDisponiveisParaAnaliseDocumentacao: getDisponiveisParaAnaliseDocumentacao,
                    getFichasParaPareceristas: getFichasParaPareceristas,
                    getDisponiveisParaAnaliseLogo: getDisponiveisParaAnaliseLogo,
                    getDisponiveisParaAnaliseAlteracao: getDisponiveisParaAnaliseAlteracao,
                    getDisponiveisParaAnaliseFormularioTrimestral: getDisponiveisParaAnaliseFormularioTrimestral,
                    getDisponiveisParaAnaliseCatalogacao: getDisponiveisParaAnaliseCatalogacao,
                    getDisponiveisParaAnalisePrestacaoContas: getDisponiveisParaAnalisePrestacaoContas,
                };
            }]);
})();