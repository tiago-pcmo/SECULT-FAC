(function () {
    "use strict";

    angular
        .module("fac")
        .controller("proponenteManutencaoController", ["$rootScope", "$scope", "$location", "entidadeService", "proponenteService", "opcoes", "utilitariosService", "apiService",
            function ($rootScope, $scope, $location, entidadeService, proponenteService, opcoes, utilitariosService, apiService) {
                $scope.modoEdicao = opcoes.modoEdicao;
                $scope.acao = utilitariosService.obtenhaLabelAcao($scope.modoEdicao);
                $scope.juridica = true;

                proponenteService.getEscolaridades().then(function (response) {
                    $scope.escolaridades = response.data;
                });

                proponenteService.getEscolaridadesSituacoes().then(function (response) {
                    $scope.escolaridadesSituacoes = response.data;
                });

                proponenteService.getAtuacoes().then(function (response) {
                    $scope.atuacoes = response.data;
                });

                if ($scope.modoEdicao) {
                    proponenteService.getProponenteLogado().then(function (response) {
                        $scope.proponente = response.data;
                        $scope.juridica = $scope.proponente.tipo === "JURIDICA";
                    });
                }

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

                $scope.getLogradouro = function (tipo) {
                    if (tipo === "JURIDICA") {
                        var objLogradouro = { "Cep": $scope.proponente.dirigente.endereco.cep }
                    } else {
                        var objLogradouro = { "Cep": $scope.proponente.endereco.cep }
                    }

                    if (utilitariosService.possuiValor(objLogradouro.Cep)) {
                        apiService.getApiCep(objLogradouro).then(function (response) {
                            if (utilitariosService.possuiValor(response.data)) {
                                var endereco = response.data[0];
                                if (tipo === "JURIDICA") {
                                    $scope.proponente.dirigente.endereco.logradouro = endereco.Logradouro;
                                    $scope.proponente.dirigente.endereco.complemento = endereco.Complemento;
                                    $scope.proponente.dirigente.endereco.bairro = endereco.Bairro;
                                    $scope.proponente.dirigente.endereco.municipio = endereco.Municipio;
                                    $scope.proponente.dirigente.endereco.uf = endereco.Estado;
                                } else {
                                    $scope.proponente.endereco.logradouro = endereco.Logradouro;
                                    $scope.proponente.endereco.complemento = endereco.Complemento;
                                    $scope.proponente.endereco.bairro = endereco.Bairro;
                                    $scope.proponente.endereco.municipio = endereco.Municipio;
                                    $scope.proponente.endereco.uf = endereco.Estado;
                                }
                            }
                        });
                    }
                };

                $rootScope.submitForm = function () {
                    var opcoesService = { entidade: opcoes.entidade, objeto: $scope.proponente };

                    if ($scope.modoEdicao) {
                        opcoesService.path = "/home";
                        entidadeService.put(opcoesService);
                    } else {
                        opcoesService.path = "/";
                        entidadeService.post(opcoesService);
                    }
                };

                $scope.cancele = function () {
                    $location.path($scope.modoEdicao ? "/home" : "/");
                };

                $scope.exclua = function () {
                    entidadeService.del({ entidade: opcoes.entidade, id: $scope.proponente.id, path: "/" });
                };

                $scope.tipoPessoa = function (tipo) {
                    $scope.juridica = tipo === "JURIDICA";
                };

                $scope.onCepChange = function (tipo) {
                    $scope.getLogradouro(tipo);
                }
            }]);
})();