(function () {
    "use strict";

    angular
        .module("app.core")
        .directive("gridEdit", function () {
            return {
                restrict: "E",
                require: "^ngModel",
                scope: {
                    form: "@",
                    label: "@",
                    lista: "=ngModel",
                    templateUrl: "@",
                    options: "="
                },
                templateUrl: function (element, attrs) {
                    return attrs.templateUrl;
                },
                link: function (scope, element, attrs, modelCtrl) {
                    scope.updateModel = function () {
                        modelCtrl.$setViewValue(scope.lista);
                    };
                },
                controller: ["$rootScope", "$scope", "$confirm", "notificacaoService", "utilitariosService",
                    function ($rootScope, $scope, $confirm, notificacaoService, utilitariosService) {
                        if (angular.isUndefined($scope.form)) {
                            throw "O atributo 'form' não foi informado para a diretiva 'grid-edit'.";
                        }

                        $scope.formCollapsed = true;

                        $scope.novo = function () {
                            $scope.formCollapsed = false;

                            inicializeItem();

                            $scope.salve = function (item) {
                                $scope.salveComum(function () {
                                    if (angular.isUndefined($scope.lista)) {
                                        $scope.lista = [];
                                    }

                                    $scope.lista.push(item);
                                });
                            };

                            scrollToForm();
                        };

                        $scope.edite = function (item) {
                            for (var i = 0; i < $scope.lista.length; i++) {
                                if (angular.equals($scope.lista[i], item)) {
                                    $scope.itemEmEdicao = $scope.lista[i];
                                    $scope.item = angular.copy($scope.itemEmEdicao);

                                    $scope.formCollapsed = false;

                                    break;
                                }
                            }

                            $scope.salve = function () {
                                $scope.salveComum(function () {
                                    angular.copy($scope.item, $scope.itemEmEdicao);
                                });
                            };

                            scrollToForm();
                        };

                        $scope.exclua = function (item) {
                            $confirm({ text: "Este item será excluído. Deseja continuar?" })
                                .then(function () {
                                    resetForm();

                                    for (var i = 0; i < $scope.lista.length; i++) {
                                        if (angular.equals($scope.lista[i], item)) {
                                            $scope.lista.splice(i, 1);

                                            $scope.updateModel();

                                            break;
                                        }
                                    }
                                });
                        };

                        $scope.salveComum = function (callbackSalvar) {
                            $rootScope.formPrincipalValid = true;

                            $scope.$broadcast("show-errors-check-validity", { form: $scope.form });

                            if ($rootScope.formPrincipalValid === true) {
                                if (typeof callbackSalvar === "function") {
                                    callbackSalvar();
                                }

                                $scope.updateModel();

                                resetForm();
                            } else {
                                notificacaoService.showError(utilitariosService.msgVerifiqueInconsistencias);
                            }
                        };

                        $scope.cancele = function () {
                            resetForm();
                        };

                        var inicializeItem = function () {
                            $scope.item = {};
                        };

                        var resetForm = function () {
                            $scope.formCollapsed = true;

                            inicializeItem();

                            $scope[$scope.form].$setPristine();
                            $scope[$scope.form].$setUntouched();

                            $scope.$broadcast("show-errors-reset", { form: $scope.form });
                        };

                        var scrollToForm = function () {
                            var $el = $("[name='" + $scope.form + "']");
                            utilitariosService.scrollToElement($el);
                        };
                    }]
            };
        });
})();