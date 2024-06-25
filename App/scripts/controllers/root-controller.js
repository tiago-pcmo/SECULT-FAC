(function () {
    "use strict";

    angular
        .module("fac")
        .controller("rootController", ["$rootScope", "$scope", "notificacaoService", "utilitariosService", "accountService", "$location",
            function ($rootScope, $scope, notificacaoService, utilitariosService, accountService, $location) {
                $scope.inicialize = function () {
                    accountService.loadAccount();

                    setTimeout(function () {
                        if (angular.element("div.navbar-collapse.collapse.in").length === 1) {
                            angular.element("button.navbar-toggle").trigger("click");
                        }
                    }, 500);
                };

                $scope.$on("$routeChangeSuccess", function (e, current, previous) {
                    $scope.limpeErrosDeValidacao();
                });

                $scope.submit = function (form) {
                    $scope.limpeErrosDeValidacao();

                    $rootScope.formPrincipalValid = true;

                    $scope.$broadcast("show-errors-check-validity", { form: form.$name });

                    if ($rootScope.formPrincipalValid === true) {
                        $rootScope.submitForm();
                    } else {
                        notificacaoService.showError(utilitariosService.msgVerifiqueInconsistencias);
                    }
                };

                $scope.limpeErrosDeValidacao = function () {
                    delete $rootScope.errosDeValidacao;
                };

                $scope.irPaginaInicial = function () {
                    if (angular.isDefined($rootScope.selectedReference)) {
                        $location.path("/home");
                    }
                }
            }]);
})();