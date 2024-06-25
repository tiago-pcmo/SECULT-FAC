(function () {
    "use strict";

    var app = "fac";
    var sessionKeyPrefix = app + ".";

    angular
        .module("fac")
        .provider("app", function () {
            this.entidades = {
                edital: "edital",
                proponente: "proponente",
                habilitador: "habilitador",
                parecerista: "parecerista",
                conselheiro: "conselheiro",
                fichaInscricao: "fichainscricao",
                referencias: "referencias",
                documentacao: "documentacao",
                segmento: "segmento",
                natureza: "natureza",
                tipoDocumento: "tipoDocumento",
                funcionario: "funcionario",
                logo: "logo",
                alteracao: "alteracao",
                formularioTrimestral: "formularioTrimestral",
                catalogacao: "catalogacao",
                formularioTrimestral: "prestacaocontas",

            };

            this.$get = function () {
                return {
                    entidades: this.entidades
                };
            };
        })
        .config(["$routeProvider", "$httpProvider", "jwtInterceptorProvider", "blockUIConfig", "appProvider", "$qProvider",
            function ($routeProvider, $httpProvider, jwtInterceptorProvider, blockUIConfig, appProvider, $qProvider) {
                /* Routes config */
                $routeProvider
                    .when("/", {
                        templateUrl: "App/views/Login.html",
                        controller: "loginController"
                    })
                    .when("/redefinir/senha", {
                        templateUrl: "App/views/RedefinirSenha.html",
                        controller: "redefinirSenhaController"
                    })
                    .when("/home", {
                        templateUrl: "App/views/Home.html",
                        controller: "homeController"
                    })
                    .when("/edital", {
                        templateUrl: "App/views/edital/Edital.html",
                        controller: "editalController",
                        resolve: { opcoes: function () { return { entidade: appProvider.entidades.edital }; } }
                    })
                    .when("/edital/novo", {
                        templateUrl: "App/views/edital/EditalManutencao.html",
                        controller: "editalManutencaoController",
                        resolve: { opcoes: function () { return { entidade: appProvider.entidades.edital, modoEdicao: false }; } }
                    })
                    .when("/edital/:id", {
                        templateUrl: "App/views/edital/EditalManutencao.html",
                        controller: "editalManutencaoController",
                        resolve: { opcoes: function () { return { entidade: appProvider.entidades.edital, modoEdicao: true }; } }
                    })
                    .when("/habilitador", {
                        templateUrl: "App/views/habilitador/Habilitador.html",
                        controller: "habilitadorController",
                        resolve: { opcoes: function () { return { entidade: appProvider.entidades.habilitador }; } }
                    })
                    .when("/habilitador/novo", {
                        templateUrl: "App/views/habilitador/HabilitadorManutencao.html",
                        controller: "habilitadorManutencaoController",
                        resolve: { opcoes: function () { return { entidade: appProvider.entidades.habilitador, modoEdicao: false }; } }
                    })
                    .when("/habilitador/:id", {
                        templateUrl: "App/views/habilitador/HabilitadorManutencao.html",
                        controller: "habilitadorManutencaoController",
                        resolve: { opcoes: function () { return { entidade: appProvider.entidades.habilitador, modoEdicao: true }; } }
                    })
                    .when("/parecerista", {
                        templateUrl: "App/views/parecerista/Parecerista.html",
                        controller: "pareceristaController",
                        resolve: { opcoes: function () { return { entidade: appProvider.entidades.parecerista }; } }
                    })
                    .when("/parecerista/novo", {
                        templateUrl: "App/views/parecerista/PareceristaManutencao.html",
                        controller: "pareceristaManutencaoController",
                        resolve: { opcoes: function () { return { entidade: appProvider.entidades.parecerista, modoEdicao: false }; } }
                    })
                    .when("/parecerista/:id", {
                        templateUrl: "App/views/parecerista/PareceristaManutencao.html",
                        controller: "pareceristaManutencaoController",
                        resolve: { opcoes: function () { return { entidade: appProvider.entidades.parecerista, modoEdicao: true }; } }
                    })
                    .when("/proponente/novo", {
                        templateUrl: "App/views/proponente/ProponenteManutencao.html",
                        controller: "proponenteManutencaoController",
                        resolve: { opcoes: function () { return { entidade: appProvider.entidades.proponente, modoEdicao: false }; } }
                    })
                    .when("/proponente/editar", {
                        templateUrl: "App/views/proponente/ProponenteManutencao.html",
                        controller: "proponenteManutencaoController",
                        resolve: { opcoes: function () { return { entidade: appProvider.entidades.proponente, modoEdicao: true }; } }
                    })
                    .when("/conselheiro", {
                        templateUrl: "App/views/conselheiro/Conselheiro.html",
                        controller: "conselheiroController",
                        resolve: { opcoes: function () { return { entidade: appProvider.entidades.conselheiro }; } }
                    })
                    .when("/conselheiro/novo", {
                        templateUrl: "App/views/conselheiro/ConselheiroManutencao.html",
                        controller: "conselheiroManutencaoController",
                        resolve: { opcoes: function () { return { entidade: appProvider.entidades.conselheiro, modoEdicao: false }; } }
                    })
                    .when("/conselheiro/:id", {
                        templateUrl: "App/views/conselheiro/ConselheiroManutencao.html",
                        controller: "conselheiroManutencaoController",
                        resolve: { opcoes: function () { return { entidade: appProvider.entidades.conselheiro, modoEdicao: true }; } }
                    })
                    .when("/avaliacao/:id", {
                        templateUrl: "App/views/avaliacao/AvaliacaoManutencao.html",
                        controller: "avaliacaoManutencaoController"
                    })
                    .when("/avaliacao/recurso/:id", {
                        templateUrl: "App/views/avaliacao/AvaliacaoManutencao.html",
                        controller: "avaliacaoManutencaoController"
                    })
                    .when("/avaliacao/recurso/resposta/:id", {
                        templateUrl: "App/views/avaliacao/AvaliacaoManutencao.html",
                        controller: "avaliacaoManutencaoController"
                    })
                    .when("/habilitacao/:id", {
                        templateUrl: "App/views/habilitacao/HabilitacaoManutencao.html",
                        controller: "habilitacaoManutencaoController"
                    })
                    .when("/habilitacao/recurso/:id", {
                        templateUrl: "App/views/habilitacao/habilitacaoManutencao.html",
                        controller: "habilitacaoManutencaoController"
                    })
                    .when("/habilitacao/recurso/resposta/:id", {
                        templateUrl: "App/views/habilitacao/HabilitacaoManutencao.html",
                        controller: "habilitacaoManutencaoController"
                    })
                    .when("/inscricao", {
                        templateUrl: "App/views/inscricao/InscricaoListagem.html",
                        controller: "inscricaoListagemController",
                        resolve: { opcoes: function () { return { entidade: appProvider.entidades.fichaInscricao }; } }
                    })
                    .when("/inscricao/nova", {
                        templateUrl: "App/views/inscricao/InscricaoManutencao.html",
                        controller: "inscricaoManutencaoController",
                        resolve: { opcoes: function () { return { entidade: appProvider.entidades.fichaInscricao, modoEdicao: false }; } }
                    })
                    .when("/inscricao/:id", {
                        templateUrl: "App/views/inscricao/InscricaoManutencao.html",
                        controller: "inscricaoManutencaoController",
                        resolve: { opcoes: function () { return { entidade: appProvider.entidades.fichaInscricao, modoEdicao: true }; } }
                    })
                    .when("/classificacao/:id", {
                        templateUrl: "App/views/classificacao/classificacao.html",
                        controller: "classificacaoController",
                        resolve: { opcoes: function () { return { entidade: appProvider.entidades.fichaInscricao }; } }
                    })
                    .when("/documentacao", {
                        templateUrl: "App/views/PosAprovacao/Documentacao/DocumentacaoListagem.html",
                        controller: "documentacaoListagemController",
                        resolve: { opcoes: function () { return { entidade: appProvider.entidades.documentacao }; } }
                    })
                    .when("/documentacao/novo", {
                        templateUrl: "App/views/PosAprovacao/Documentacao/DocumentacaoManutencao.html",
                        controller: "documentacaoManutencaoController",
                        resolve: { opcoes: function () { return { entidade: appProvider.entidades.documentacao, modoEdicao: false }; } }
                    })
                    .when("/documentacao/:id", {
                        templateUrl: "App/views/PosAprovacao/Documentacao/DocumentacaoManutencao.html",
                        controller: "documentacaoManutencaoController",
                        resolve: { opcoes: function () { return { entidade: appProvider.entidades.documentacao, modoEdicao: true }; } }
                    })
                    .when("/aprovacao", {
                        templateUrl: "App/views/PosAprovacao/Documentacao/DocumentacaoAprovacao.html",
                        controller: "documentacaoAprovacaoController",
                        resolve: { opcoes: function () { return { entidade: appProvider.entidades.documentacao }; } }
                    })
                    .when("/documentacaoFicha/:id", {
                        templateUrl: "App/views/PosAprovacao/Documentacao/DocumentacaoFicha.html",
                        controller: "documentacaoFichaController",
                        resolve: { opcoes: function () { return { entidade: appProvider.entidades.documentacao }; } }
                    })
                    .when("/segmento", {
                        templateUrl: "App/views/edital/segmento/Segmento.html",
                        controller: "segmentoListagemController",
                        resolve: { opcoes: function () { return { entidade: appProvider.entidades.segmento }; } }
                    })
                    .when("/segmento/novo", {
                        templateUrl: "App/views/edital/segmento/SegmentoManutencao.html",
                        controller: "segmentoManutencaoController",
                        resolve: { opcoes: function () { return { entidade: appProvider.entidades.segmento, modoEdicao: false }; } }
                    })
                    .when("/segmento/:id", {
                        templateUrl: "App/views/edital/segmento/SegmentoManutencao.html",
                        controller: "segmentoManutencaoController",
                        resolve: { opcoes: function () { return { entidade: appProvider.entidades.segmento, modoEdicao: true }; } }
                    })
                    .when("/natureza", {
                        templateUrl: "App/views/edital/natureza/natureza.html",
                        controller: "naturezaListagemController",
                        resolve: { opcoes: function () { return { entidade: appProvider.entidades.natureza }; } }
                    })
                    .when("/natureza/novo", {
                        templateUrl: "App/views/edital/natureza/NaturezaManutencao.html",
                        controller: "naturezaManutencaoController",
                        resolve: { opcoes: function () { return { entidade: appProvider.entidades.natureza, modoEdicao: false }; } }
                    })
                    .when("/natureza/:id", {
                        templateUrl: "App/views/edital/natureza/NaturezaManutencao.html",
                        controller: "naturezaManutencaoController",
                        resolve: { opcoes: function () { return { entidade: appProvider.entidades.natureza, modoEdicao: true }; } }
                    })
                    .when("/tipoDocumento", {
                        templateUrl: "App/views/tipoDocumento/tipoDocumento.html",
                        controller: "tipoDocumentoListagemController",
                        resolve: { opcoes: function () { return { entidade: appProvider.entidades.tipoDocumento }; } }
                    })
                    .when("/tipoDocumento/novo", {
                        templateUrl: "App/views/tipoDocumento/tipoDocumentoManutencao.html",
                        controller: "tipoDocumentoManutencaoController",
                        resolve: { opcoes: function () { return { entidade: appProvider.entidades.tipoDocumento, modoEdicao: false }; } }
                    })
                    .when("/tipoDocumento/:id", {
                        templateUrl: "App/views/tipoDocumento/tipoDocumentoManutencao.html",
                        controller: "tipoDocumentoManutencaoController",
                        resolve: { opcoes: function () { return { entidade: appProvider.entidades.tipoDocumento, modoEdicao: true }; } }
                    })
                    .when("/funcionario", {
                        templateUrl: "App/views/funcionario/funcionario.html",
                        controller: "funcionarioListagemController",
                        resolve: { opcoes: function () { return { entidade: appProvider.entidades.funcionario }; } }
                    })
                    .when("/funcionario/novo", {
                        templateUrl: "App/views/funcionario/funcionarioManutencao.html",
                        controller: "funcionarioManutencaoController",
                        resolve: { opcoes: function () { return { entidade: appProvider.entidades.funcionario, modoEdicao: false }; } }
                    })
                    .when("/funcionario/:id", {
                        templateUrl: "App/views/funcionario/funcionarioManutencao.html",
                        controller: "funcionarioManutencaoController",
                        resolve: { opcoes: function () { return { entidade: appProvider.entidades.funcionario, modoEdicao: true }; } }
                    })
                    .when("/logo", {
                        templateUrl: "App/views/PosAprovacao/Logo/LogoListagem.html",
                        controller: "logoListagemController",
                        resolve: { opcoes: function () { return { entidade: appProvider.entidades.logo }; } }
                    })
                    .when("/logo/novo", {
                        templateUrl: "App/views/PosAprovacao/Logo/LogoManutencao.html",
                        controller: "logoManutencaoController",
                        resolve: { opcoes: function () { return { entidade: appProvider.entidades.logo, modoEdicao: false }; } }
                    })
                    .when("/logo/:id", {
                        templateUrl: "App/views/PosAprovacao/Logo/LogoManutencao.html",
                        controller: "logoManutencaoController",
                        resolve: { opcoes: function () { return { entidade: appProvider.entidades.logo, modoEdicao: true }; } }
                    })
                    .when("/logoAprovacao", {
                        templateUrl: "App/views/PosAprovacao/Logo/LogoAprovacao.html",
                        controller: "logoAprovacaoController",
                        resolve: { opcoes: function () { return { entidade: appProvider.entidades.logo }; } }
                    })
                    .when("/logoFicha/:id", {
                        templateUrl: "App/views/PosAprovacao/Logo/LogoFicha.html",
                        controller: "logoFichaController",
                        resolve: { opcoes: function () { return { entidade: appProvider.entidades.logo }; } }
                    })
                    .when("/alteracao", {
                        templateUrl: "App/views/PosAprovacao/Alteracao/AlteracaoListagem.html",
                        controller: "alteracaoListagemController",
                        resolve: { opcoes: function () { return { entidade: appProvider.entidades.alteracao }; } }
                    })
                    .when("/alteracaoAprovacao", {
                        templateUrl: "App/views/PosAprovacao/Alteracao/AlteracaoAprovacao.html",
                        controller: "alteracaoListagemController",
                        resolve: { opcoes: function () { return { entidade: appProvider.entidades.alteracao }; } }
                    })
                    .when("/alteracao/novo", {
                        templateUrl: "App/views/PosAprovacao/Alteracao/AlteracaoManutencao.html",
                        controller: "alteracaoManutencaoController",
                        resolve: { opcoes: function () { return { entidade: appProvider.entidades.alteracao, modoEdicao: false }; } }
                    })
                    .when("/alteracao/:id", {
                        templateUrl: "App/views/PosAprovacao/Alteracao/AlteracaoManutencao.html",
                        controller: "alteracaoManutencaoController",
                        resolve: { opcoes: function () { return { entidade: appProvider.entidades.alteracao, modoEdicao: true }; } }
                    })
                    .when("/alteracaoAprovacao", {
                        templateUrl: "App/views/PosAprovacao/Alteracao/AlteracaoAprovacao.html",
                        controller: "alteracaoAprovacaoController",
                        resolve: { opcoes: function () { return { entidade: appProvider.entidades.alteracao }; } }
                    })
                    .when("/alteracaoFicha/:id", {
                        templateUrl: "App/views/PosAprovacao/Alteracao/AlteracaoFicha.html",
                        controller: "alteracaoFichaController",
                        resolve: { opcoes: function () { return { entidade: appProvider.entidades.alteracao }; } }
                    })
                    .when("/formularioTrimestral", {
                        templateUrl: "App/views/PosAprovacao/FormularioTrimestral/FormularioTrimestralListagem.html",
                        controller: "formularioTrimestralListagemController",
                        resolve: { opcoes: function () { return { entidade: appProvider.entidades.formularioTrimestral }; } }
                    })
                    .when("/formularioTrimestralAprovacao", {
                        templateUrl: "App/views/PosAprovacao/FormularioTrimestral/FormularioTrimestralAprovacao.html",
                        controller: "formularioTrimestralListagemController",
                        resolve: { opcoes: function () { return { entidade: appProvider.entidades.formularioTrimestral }; } }
                    })
                    .when("/formularioTrimestral/novo", {
                        templateUrl: "App/views/PosAprovacao/FormularioTrimestral/FormularioTrimestralManutencao.html",
                        controller: "formularioTrimestralManutencaoController",
                        resolve: { opcoes: function () { return { entidade: appProvider.entidades.formularioTrimestral, modoEdicao: false }; } }
                    })
                    .when("/formularioTrimestral/:id", {
                        templateUrl: "App/views/PosAprovacao/FormularioTrimestral/FormularioTrimestralManutencao.html",
                        controller: "formularioTrimestralManutencaoController",
                        resolve: { opcoes: function () { return { entidade: appProvider.entidades.formularioTrimestral, modoEdicao: true }; } }
                    })
                    .when("/formularioTrimestralAprovacao", {
                        templateUrl: "App/views/PosAprovacao/FormularioTrimestral/FormularioTrimestralAprovacao.html",
                        controller: "formularioTrimestralAprovacaoController",
                        resolve: { opcoes: function () { return { entidade: appProvider.entidades.formularioTrimestral }; } }
                    })
                    .when("/formularioTrimestralFicha/:id", {
                        templateUrl: "App/views/PosAprovacao/FormularioTrimestral/FormularioTrimestralFicha.html",
                        controller: "formularioTrimestralFichaController",
                        resolve: { opcoes: function () { return { entidade: appProvider.entidades.formularioTrimestral }; } }
                    })
                    .when("/catalogacao", {
                        templateUrl: "App/views/PosAprovacao/Catalogacao/CatalogacaoListagem.html",
                        controller: "catalogacaoListagemController",
                        resolve: { opcoes: function () { return { entidade: appProvider.entidades.catalogacao }; } }
                    })
                    .when("/catalogacao/novo", {
                        templateUrl: "App/views/PosAprovacao/Catalogacao/CatalogacaoManutencao.html",
                        controller: "catalogacaoManutencaoController",
                        resolve: { opcoes: function () { return { entidade: appProvider.entidades.catalogacao, modoEdicao: false }; } }
                    })
                    .when("/catalogacao/:id", {
                        templateUrl: "App/views/PosAprovacao/Catalogacao/CatalogacaoManutencao.html",
                        controller: "catalogacaoManutencaoController",
                        resolve: { opcoes: function () { return { entidade: appProvider.entidades.catalogacao, modoEdicao: true }; } }
                    })
                    .when("/catalogacaoAprovacao", {
                        templateUrl: "App/views/PosAprovacao/Catalogacao/CatalogacaoAprovacao.html",
                        controller: "catalogacaoAprovacaoController",
                        resolve: { opcoes: function () { return { entidade: appProvider.entidades.catalogacao }; } }
                    })
                    .when("/catalogacaoFicha/:id", {
                        templateUrl: "App/views/PosAprovacao/Catalogacao/CatalogacaoFicha.html",
                        controller: "catalogacaoFichaController",
                        resolve: { opcoes: function () { return { entidade: appProvider.entidades.catalogacao }; } }
                    })
                    .when("/prestacaoContas", {
                        templateUrl: "App/views/PosAprovacao/PrestacaoContas/PrestacaoContasListagem.html",
                        controller: "prestacaoContasListagemController",
                        resolve: { opcoes: function () { return { entidade: appProvider.entidades.prestacaoContas }; } }
                    })
                    .when("/prestacaoContasAprovacao", {
                        templateUrl: "App/views/PosAprovacao/PrestacaoContas/PrestacaoContasAprovacao.html",
                        controller: "prestacaoContasListagemController",
                        resolve: { opcoes: function () { return { entidade: appProvider.entidades.prestacaoContas }; } }
                    })
                    .when("/prestacaoContas/novo", {
                        templateUrl: "App/views/PosAprovacao/PrestacaoContas/PrestacaoContasManutencao.html",
                        controller: "prestacaoContasManutencaoController",
                        resolve: { opcoes: function () { return { entidade: appProvider.entidades.prestacaoContas, modoEdicao: false }; } }
                    })
                    .when("/prestacaoContas/:id", {
                        templateUrl: "App/views/PosAprovacao/PrestacaoContas/PrestacaoContasManutencao.html",
                        controller: "prestacaoContasManutencaoController",
                        resolve: { opcoes: function () { return { entidade: appProvider.entidades.prestacaoContas, modoEdicao: true }; } }
                    })
                    .when("/prestacaoContasAprovacao", {
                        templateUrl: "App/views/PosAprovacao/PrestacaoContas/PrestacaoContasAprovacao.html",
                        controller: "prestacaoContasAprovacaoController",
                        resolve: { opcoes: function () { return { entidade: appProvider.entidades.prestacaoContas }; } }
                    })
                    .when("/prestacaoContasFicha/:id", {
                        templateUrl: "App/views/PosAprovacao/PrestacaoContas/PrestacaoContasFicha.html",
                        controller: "prestacaoContasFichaController",
                        resolve: { opcoes: function () { return { entidade: appProvider.entidades.prestacaoContas }; } }
                    })
                    .otherwise({ redirectTo: "/home" });

                /* JWT config (Authorization Bearer Token Injection) */
                jwtInterceptorProvider.tokenGetter = function () {
                    return angular.fromJson(localStorage.getItem(sessionKeyPrefix + "JWT"));
                };

                $httpProvider.interceptors.push("jwtInterceptor");
                $httpProvider.interceptors.push("referenceContextInterceptor");

                // Disable IE ajax request caching.
                if (!$httpProvider.defaults.headers.get) {
                    $httpProvider.defaults.headers.common = {};
                }

                // $httpProvider.defaults.headers.common["If-Modified-Since"] = "Mon, 26 Jul 1997 05:00:00 GMT";
                $httpProvider.defaults.headers.common["Cache-Control"] = "no-cache";
                $httpProvider.defaults.headers.common["Pragma"] = "no-cache";

                /* Block UI */
                blockUIConfig.delay = 0;
                blockUIConfig.message = "Aguarde ...";
                blockUIConfig.blockBrowserNavigation = true;
                blockUIConfig.requestFilter = function (config) {
                    var message;

                    switch (config.method) {
                        case "GET":
                            message = "Obtendo dados ...";
                            break;
                    }

                    return message;
                };

                // Prevent "Possibly unhandled rejection" from Angular 1.6
                $qProvider.errorOnUnhandledRejections(false);
            }]
        )
        .run(["$confirmModalDefaults", "amMoment",
            function ($confirmModalDefaults, amMoment) {
                /* Angular confirm */
                $confirmModalDefaults.defaultLabels.title = "Confirmação";
                $confirmModalDefaults.defaultLabels.ok = "Sim";
                $confirmModalDefaults.defaultLabels.cancel = "Não";
                $confirmModalDefaults.templateUrl = "App/views/ModalConfirmExclusao.html";

                /* Angular moment */
                amMoment.changeLocale("pt-br");

                /* Numeral JS */
                numeral.locale("pt-br");
            }]
        )
        .factory("referenceContextInterceptor", function () {
            return {
                request: function (config) {
                    var selectedReference = angular.fromJson(localStorage.getItem(sessionKeyPrefix + "selectedReference"));

                    if (selectedReference) {
                        config.headers["Reference-Year"] = selectedReference.year;
                    }
                    return config;
                }
            };
        })
        .constant("APP", app)
        .constant("SESSION_KEY_PREFIX", sessionKeyPrefix);
})();