(function () {
    "use strict";

    angular
        .module("app.core")
        .directive("fieldMatch", function () {
            return {
                restrict: "A",
                require: "ngModel",
                link: function (scope, elem, attrs, ctrl) {
                    var firstField = "[name='" + attrs.fieldMatch + "']";

                    elem.add(firstField).on("keyup", function () {
                        scope.$apply(function () {
                            var valuesMatch = elem.val() === $(firstField).val();
                            ctrl.$setValidity("fieldmatch", valuesMatch);
                        });
                    });
                }
            }
        });
})();