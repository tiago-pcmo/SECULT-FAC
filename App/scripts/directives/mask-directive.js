(function () {
    "use strict";

    angular
        .module("app.core")
        .directive("mask", function () {
            return {
                restrict: "A",
                require: "ngModel",
                link: function (scope, element, attrs, modelCtrl) {
                    var mask = attrs.mask;
                    var maskClean = angular.isUndefined(attrs.maskClean) ? true : scope.$eval(attrs.maskClean);
                    var maskNumber = scope.$eval(attrs.maskNumber);
                    var maskOptions = scope.$eval(attrs.maskOptions);
                    var $el = $(element);

                    $el.mask(mask, maskOptions);

                    modelCtrl.$formatters.push(function (inputValue) {
                        if (angular.isDefined(inputValue) && inputValue !== null) {
                            var inputValueString = inputValue + "";

                            if (mask.indexOf(",") > 0 && maskNumber === true) {
                                var decimalLenghtMask = mask.split(",")[1].length;

                                if (inputValueString.indexOf(".") > 0) {
                                    var decimalLengthValue = inputValueString.split(".")[1].length;

                                    if (decimalLengthValue !== decimalLenghtMask) {
                                        var counter = decimalLenghtMask - decimalLengthValue;

                                        for (var i = 0; i < counter; i++) {
                                            inputValueString += "0";
                                        }
                                    }
                                } else {
                                    inputValueString += ".";

                                    for (var i = 0; i < decimalLenghtMask; i++) {
                                        inputValueString += "0";
                                    }
                                }
                            }

                            return $el.masked(inputValueString);
                        } else {
                            $el.val(inputValue);
                        }
                    });

                    modelCtrl.$parsers.push(function (inputValue) {
                        if (maskNumber === true) {
                            var number = $el.masked();

                            number = number.replace(/\./g, "");
                            number = number.replace(",", ".");

                            return number;
                        }

                        if (maskClean !== false) {
                            return $el.cleanVal();
                        }

                        return $el.masked();
                    });
                }
            };
        });
})();