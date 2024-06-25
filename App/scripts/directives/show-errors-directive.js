(function () {
    "use strict";

    angular
        .module("app.core")
        .directive("showErrors", ["$timeout", "showErrorsConfig", "$interpolate", "$rootScope",
            function ($timeout, showErrorsConfig, $interpolate, $rootScope) {
                return {
                    restrict: "A",
                    require: "^form",
                    compile: function (elem, attrs) {
                        if (attrs["showErrors"].indexOf("skipFormGroupCheck") === -1) {
                            if (!(elem.hasClass("form-group") || elem.hasClass("input-group"))) {
                                throw "show-errors element does not have the 'form-group' or 'input-group' class";
                            }
                        }

                        return function (scope, el, attrs, formCtrl) {
                            var blurred, inputEl, inputName, inputNgEl, options, showSuccess, toggleClasses, trigger;
                            var getShowSuccess, getTrigger;

                            getTrigger = function (options) {
                                var trigger;

                                trigger = showErrorsConfig.trigger;

                                if (options && options.trigger !== null) {
                                    trigger = options.trigger;
                                }

                                return trigger;
                            };

                            getShowSuccess = function (options) {
                                var showSuccess;

                                showSuccess = showErrorsConfig.showSuccess;

                                if (options && options.showSuccess !== null) {
                                    showSuccess = options.showSuccess;
                                }

                                return showSuccess;
                            };

                            blurred = false;
                            options = scope.$eval(attrs.showErrors);
                            showSuccess = getShowSuccess(options);
                            trigger = getTrigger(options);
                            inputEl = el[0].querySelector(".form-control[name]");
                            inputNgEl = angular.element(inputEl);
                            inputName = $interpolate(inputNgEl.attr("name") || "")(scope);

                            if (!inputName) {
                                throw "show-errors element has no child input elements with a 'name' attribute and a 'form-control' class";
                            }

                            inputNgEl.bind(trigger, function () {
                                blurred = true;
                                return toggleClasses(formCtrl[inputName].$invalid);
                            });

                            scope.$watch(function () {
                                return formCtrl[inputName] && formCtrl[inputName].$invalid;
                            }, function (invalid) {
                                if (!blurred) {
                                    return;
                                }

                                return toggleClasses(invalid);
                            });

                            scope.$on("show-errors-check-validity", function (e, args) {
                                if (angular.isUndefined(args) && angular.isUndefined(args.form)) {
                                    throw "O nome do form deve ser passado para o trigger do evento responsável por mostrar os erros. Ex.: '{ form: 'teste' }'";
                                }

                                if (formCtrl.$name === args.form) {
                                    return toggleClasses(formCtrl[inputName].$invalid);
                                }
                            });

                            scope.$on("show-errors-reset", function (e, args) {
                                if (angular.isUndefined(args) && angular.isUndefined(args.form)) {
                                    throw "O nome do form deve ser passado para o trigger do evento responsável por limpar os erros. Ex.: '{ form: 'teste' }'";
                                }

                                if (formCtrl.$name === args.form) {
                                    return $timeout(function () {
                                        el.removeClass("has-error");
                                        el.removeClass("has-success");
                                        $(".help-block.custom-validation", el).remove();

                                        return blurred = false;
                                    }, 0, false);
                                }
                            });

                            return toggleClasses = function (invalid) {
                                el.toggleClass("has-error", invalid);

                                $(".help-block.custom-validation", el).remove();

                                if (invalid === true) {
                                    var input = el[0].querySelector(".form-control[name]");
                                    var $span = $("<span>", { "class": "help-block custom-validation" });

                                    if (formCtrl[inputName].$error.required) {
                                        $span.text("Campo obrigatório.");
                                    } else if (formCtrl[inputName].$error.email || (input.type === "email" && formCtrl[inputName].$error.pattern)) {
                                        $span.text("Email inválido.");
                                    } else if (formCtrl[inputName].$error.url || (input.type === "url" && formCtrl[inputName].$error.pattern)) {
                                        $span.text("URL inválida.");
                                    }

                                    el.append($span);

                                    $rootScope.formPrincipalValid = false;
                                }

                                if (showSuccess) {
                                    return el.toggleClass("has-success", !invalid);
                                }
                            };
                        };
                    }
                };
            }])
        .provider("showErrorsConfig", function () {
            var _showSuccess, _trigger;

            _showSuccess = false;
            _trigger = "blur keypress";

            this.showSuccess = function (showSuccess) {
                return _showSuccess = showSuccess;
            };

            this.trigger = function (trigger) {
                return _trigger = trigger;
            };

            this.$get = function () {
                return {
                    showSuccess: _showSuccess,
                    trigger: _trigger
                };
            };
        });
})();