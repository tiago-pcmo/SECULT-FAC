(function () {
    "use strict";

    angular
        .module("app.core")
        .directive("fileUpload", ["$timeout", "$interval", "blockUI", "utilitariosService",
            function ($timeout, $interval, blockUI, utilitariosService) {
                return {
                    restrict: "E",
                    require: "^ngModel",
                    scope: {
                        modelValue: "=ngModel",
                        label: "@",
                        nome: "@",
                        extensao: "@",
                        accept: "@",
                        downloadFn: "=",
                        background: "=",
                        readOnly: "=",
                        gridView: "="
                    },
                    templateUrl: "App/views/FileUpload.html",
                    link: function (scope, element, attrs, modelCtrl) {
                        scope.reset = function () {
                            scope.progress = 0;
                            scope.fileChanged = false;
                        };

                        scope.reset();

                        scope.$watch("modelValue", function (novoModelValue) {
                            if (angular.isUndefined(novoModelValue)) {
                                scope.reset();
                            }
                        });

                        scope.onChangeFile = function (element) {
                            if (!utilitariosService.possuiValor(scope.modelValue)) {
                                scope.modelValue = {};
                            }

                            if (element.files.length > 0) {
                                var file = element.files[0];
                                var lastDotIndex = file.name.lastIndexOf('.');
                                var fileNameArray = [file.name.slice(0, lastDotIndex), file.name.slice(lastDotIndex + 1)];
                                var fileName = fileNameArray[0];
                                var fileExtension = fileNameArray[1];

                                scope.fileChanged = true;

                                if (angular.isDefined(scope.extensao) && scope.extensao.toLowerCase() !== fileExtension.toLowerCase()) {
                                    scope.processError({
                                        typeProgress: "danger",
                                        fileUploadResult: "Arquivo inválido. A extensão dever ser '." + scope.extensao + "'"
                                    });
                                } else {
                                    var fileReader = new FileReader();

                                    fileReader.onload = function (e) {
                                        scope.modelValue.nome = angular.isUndefined(scope.nome) ? fileName : scope.nome;
                                        scope.modelValue.extensao = angular.isUndefined(scope.extensao) ? fileExtension : scope.extensao;
                                        scope.modelValue.tamanho = +(file.size / (1024 * 1024)).toFixed(2);
                                        scope.modelValue.conteudo = utilitariosService.arrayBufferToBase64(e.target.result);

                                        modelCtrl.$setViewValue(scope.modelValue);

                                        scope.renderProgress({ fileUploadResult: "Arquivo selecionado com sucesso", showSuccess: true });
                                    };

                                    fileReader.readAsArrayBuffer(file);

                                    $(element).val("");
                                }
                            } else {
                                scope.modelValue = null;

                                scope.processError({
                                    typeProgress: "danger",
                                    fileUploadResult: "Nenhum arquivo selecionado"
                                });
                            }
                        };

                        scope.downloadCallback = function (base64BinaryString) {
                            var arrayBuffer = utilitariosService.base64ToArrayBuffer(base64BinaryString);
                            var blob = new Blob([arrayBuffer], { type: scope.modelValue.mimeType });

                            saveAs(blob, scope.modelValue.nomeCompleto);
                        };

                        scope.renderProgress = function (options) {
                            scope.progress = 0;
                            scope.typeProgress = options.typeProgress;
                            scope.fileUploadResult = options.fileUploadResult;

                            $timeout(function () {
                                $interval(function () {
                                    scope.progress += 25;
                                }, 100, 4);

                                if (options.showSuccess === true) {
                                    $timeout(function () {
                                        scope.typeProgress = "success";
                                    }, 1000);
                                }
                            }, 500);
                        };

                        scope.processError = function (options) {
                            if (utilitariosService.possuiValor(scope.modelValue)) {
                                scope.modelValue.conteudo = null;
                            }

                            modelCtrl.$setViewValue(scope.modelValue);

                            scope.renderProgress(options);
                        };
                    }
                };
            }]);
})();