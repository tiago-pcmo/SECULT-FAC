(function () {
    "use strict";

    angular
        .module("fac")
        .controller("redefinirSenhaController", ["$rootScope", "$scope", "$location", "apiService", "notificacaoService", "utilitariosService",
            function ($rootScope, $scope, $location, apiService, notificacaoService, utilitariosService) {
                $rootScope.submitForm = function () {
                    apiService.put("account/redefinepassword", $scope.redefinirSenhaModel).then(
                        function (response) {
                            notificacaoService.showSuccess("Senha alterada com sucesso.");
                            $location.path("/");
                        },
                        function (response) {
                            var result = response.data;

                            if (utilitariosService.possuiValor(result)) {
                                var message = result[0].message;
                                notificacaoService.showError(message);
                            }
                        });
                };

                $scope.cancelar = function () {
                    $location.path("/");
                };
            }]);
})();