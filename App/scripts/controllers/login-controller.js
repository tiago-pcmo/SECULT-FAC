(function () {
    "use strict";

    angular
        .module("fac")
        .controller("loginController", ["$rootScope", "$scope", "$location", "apiService", "utilitariosService", "accountService",
            function ($rootScope, $scope, $location, apiService, utilitariosService, accountService) {
                accountService.logout();
                $rootScope.submitForm = function () {
                    $location.path("/home");

                    //apiService.post("account/login", $scope.loginModel).then(
                    //    function (response) {
                    //        var result = response.data;

                    //        if (utilitariosService.possuiValor(result)) {
                    //            accountService.setAccount(result.access_token);
                    //        }

                    //        $location.path("/home");
                    //    });
                };

                $scope.cadastrarProponente = function () {
                    $location.path("/proponente/novo");
                };
            }]);
})();