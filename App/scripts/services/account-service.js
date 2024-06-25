(function () {
    "use strict";

    angular
        .module("app.core")
        .factory("accountService", ["$rootScope", "$route", "$location", "jwtHelper", "apiService", "notificacaoService", "utilitariosService", "sessionService",
            function ($rootScope, $route, $location, jwtHelper, apiService, notificacaoService, utilitariosService, sessionService) {
                var jwtKey = "JWT";
                var accountKey = "account";
                var menuKey = "menu";
                var referenceKey = "reference";
                var selectedReferenceKey = "selectedReference";

                var setAccount = function (jwt) {
                    var account = jwtHelper.decodeToken(jwt);

                    sessionService.setItem(jwtKey, jwt);
                    sessionService.setItem(accountKey, account);
                };

                var getAccount = function () {
                    //var account = sessionService.getItem(accountKey);
                    //if (!utilitariosService.possuiValor(account)) {
                    //    return null;
                    //}

                    //if (!account.given_name) {
                    //    account.given_name = account["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname"];
                    //}

                    //if (!account.family_name) {
                    //    account.family_name = account["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname"];
                    //}

                    //if (!account.role) {
                    //    account.role = account["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
                    //}

                    var account = { given_name: 'Tiago', family_name: 'Portella', role: 'administrador' };
                    
                    return utilitariosService.possuiValor(account) ? account : null;
                };

                var userIsLoggedIn = function () {
                    return utilitariosService.possuiValor(getToken());
                };

                var loadAccount = function () {
                    var account = getAccount();

                    console.log(account);

                    if (utilitariosService.possuiValor(account)) {
                        //var token = getToken();

                        //if (utilitariosService.possuiValor(token)) {
                            //var tokenExpired = jwtHelper.isTokenExpired(token);

                            //if (!tokenExpired) {


                                var fullName = account.given_name !== account.family_name;

                                $rootScope.userContext = {
                                    displayName: fullName ? account.given_name + " " + account.family_name : account.given_name
                                };

                                loadMenu();
                                loadReference();

                                return;
                            //}

                            //sessaoExprirada();
                        //}
                    } else {
                        sessaoExprirada();
                    }
                };

                var getToken = function () {
                    return sessionService.getItem(jwtKey);
                };

                var loadMenu = function () {
                    var menu = sessionService.getItem(menuKey);

                    if (utilitariosService.possuiValor(menu)) {
                        $rootScope.menu = menu;
                    }
                    else {
                        apiService.get("appaccount/getmenu").then(
                            function (response) {
                                var menu = response.data;

                                if (utilitariosService.possuiValor(menu)) {
                                    $rootScope.menu = menu;
                                    sessionService.setItem(menuKey, menu);
                                }
                            });
                    }
                };

                var loadReference = function () {
                    var reference = sessionService.getItem(referenceKey);

                    if (utilitariosService.possuiValor(reference)) {
                        $rootScope.reference = reference;
                        loadSelectedReference($rootScope.reference[0]);
                    }
                    else {
                        apiService.get("reference").then(
                            function (response) {
                                var reference = response.data;

                                if (utilitariosService.possuiValor(reference)) {
                                    $rootScope.reference = reference;
                                    sessionService.setItem(referenceKey, reference);
                                    loadSelectedReference($rootScope.reference[0]);
                                }
                            });
                    }

                    $rootScope.setSelectedReference = function (reference, reload) {
                        $rootScope.selectedReference = reference;
                        sessionService.setItem(selectedReferenceKey, $rootScope.selectedReference);

                        if (reload !== false) {
                            $route.reload();
                        }
                    };
                };

                var loadSelectedReference = function (reference) {
                    var selectedReference = sessionService.getItem(selectedReferenceKey);

                    if (utilitariosService.possuiValor(selectedReference)) {
                        $rootScope.selectedReference = selectedReference;
                    } else {
                        $rootScope.selectedReference = reference;
                        sessionService.setItem(selectedReferenceKey, reference);
                    };
                };

                var getRoles = function (callback) {
                    if (typeof callback === "function") {
                        apiService.get("appaccount/GetRoles").then(
                            function (response) {
                                var roles = response.data;
                                callback(roles);
                            });
                    }
                };

                var sessaoExprirada = function () {
                    notificacaoService.showInfo("Sessão expirada.");
                    $location.path("/");
                };

                var logout = function () {
                    sessionService.clear();

                    delete $rootScope.userContext;
                    delete $rootScope.menu;
                    delete $rootScope.reference;
                    delete $rootScope.selectedReference;

                    $location.path("/");
                };

                return {
                    setAccount: setAccount,
                    getAccount: getAccount,
                    userIsLoggedIn: userIsLoggedIn,
                    loadAccount: loadAccount,
                    getToken: getToken,
                    getRoles: getRoles,
                    logout: logout
                };
            }]);
})();