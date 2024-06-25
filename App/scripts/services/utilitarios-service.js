(function () {
    "use strict";

    angular
        .module("app.core")
        .factory("utilitariosService", ["$location", "notificacaoService",
            function ($location, notificacaoService) {
                var msgVerifiqueInconsistencias = "Verifique a(s) inconsistência(s).";
                var msgEsteItemSeraExcluido = "Este item será excluído. Deseja continuar?";
                var formatoDeData = "DD/MM/YYYY";

                var roles = {
                    administrador: "administrador",
                    proponente: "proponente",
                    habilitador: "habilitador",
                    parecerista: "parecerista",
                    conselheiro: "conselheiro",
                    funcionariofac: "funcionariofac",
                    auditoria: "auditoria"
                };

                var possuiValor = function (dado) {

                    if (typeof dado === "number") {
                        return !isNaN(parseInt(dado));
                    }

                    if (typeof dado === "object" && dado !== null) {
                        if (dado.constructor === Array) {
                            return dado.length > 0;
                        }

                        return !$.isEmptyObject(dado);
                    }

                    return dado !== null && dado !== undefined && dado !== "undefined" && dado !== "";
                };

                var obtenhaLabelAcao = function (modoEdicao) {
                    return modoEdicao ? "Edição" : "Cadastro";
                };

                var scrollToElement = function ($el) {
                    setTimeout(function () {
                        var elOffset = $el.offset().top;
                        var elHeight = $el.height();
                        var windowHeight = $(window).height();
                        var offset = elOffset;

                        if (elHeight < windowHeight) {
                            offset = elOffset - (windowHeight / 2 - elHeight / 2);
                        }

                        $('html, body').animate({ scrollTop: offset }, "slow");
                    }, 250);
                };

                var getIntDate = function (stringDate) {
                    var arrayDate = stringDate.split("/");
                    var intDate = "";

                    for (var i = arrayDate.length - 1; i >= 0; i--) {
                        intDate += arrayDate[i];
                    }

                    intDate = parseInt(intDate);

                    return intDate;
                };

                var operacaoNaoAutorizada = function (path) {
                    console.log(path);
                    notificacaoService.showError("Operação não autorizada.");

                    if (possuiValor(path)) {
                        $location.path(path);
                    }
                };

                var base64ToArrayBuffer = function (strBase64) {
                    var str = atob(strBase64);
                    var buf = new ArrayBuffer(str.length);
                    var bufView = new Uint8Array(buf);
                    for (var i = 0, strLen = str.length; i < strLen; i++) {
                        bufView[i] = str.charCodeAt(i);
                    }
                    return buf;
                };

                var arrayBufferToBase64 = function (arrayBuffer) {
                    var base64 = '';
                    var encodings = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

                    var bytes = new Uint8Array(arrayBuffer);
                    var byteLength = bytes.byteLength;
                    var byteRemainder = byteLength % 3;
                    var mainLength = byteLength - byteRemainder;

                    var a, b, c, d;
                    var chunk;

                    // Main loop deals with bytes in chunks of 3
                    for (var i = 0; i < mainLength; i = i + 3) {
                        // Combine the three bytes into a single integer
                        chunk = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2];

                        // Use bitmasks to extract 6-bit segments from the triplet
                        a = (chunk & 16515072) >> 18; // 16515072 = (2^6 - 1) << 18
                        b = (chunk & 258048) >> 12; // 258048   = (2^6 - 1) << 12
                        c = (chunk & 4032) >> 6; // 4032     = (2^6 - 1) << 6
                        d = chunk & 63;               // 63       = 2^6 - 1

                        // Convert the raw binary segments to the appropriate ASCII encoding
                        base64 += encodings[a] + encodings[b] + encodings[c] + encodings[d];
                    }

                    // Deal with the remaining bytes and padding
                    if (byteRemainder === 1) {
                        chunk = bytes[mainLength];

                        a = (chunk & 252) >> 2; // 252 = (2^6 - 1) << 2

                        // Set the 4 least significant bits to zero
                        b = (chunk & 3) << 4; // 3   = 2^2 - 1

                        base64 += encodings[a] + encodings[b] + '==';
                    } else if (byteRemainder === 2) {
                        chunk = (bytes[mainLength] << 8) | bytes[mainLength + 1];

                        a = (chunk & 64512) >> 10; // 64512 = (2^6 - 1) << 10
                        b = (chunk & 1008) >> 4; // 1008  = (2^6 - 1) << 4

                        // Set the 2 least significant bits to zero
                        c = (chunk & 15) << 2; // 15    = 2^4 - 1

                        base64 += encodings[a] + encodings[b] + encodings[c] + '=';
                    }

                    return base64;
                };

                return {
                    msgVerifiqueInconsistencias: msgVerifiqueInconsistencias,
                    msgEsteItemSeraExcluido: msgEsteItemSeraExcluido,
                    formatoDeData: formatoDeData,
                    possuiValor: possuiValor,
                    obtenhaLabelAcao: obtenhaLabelAcao,
                    scrollToElement: scrollToElement,
                    base64ToArrayBuffer: base64ToArrayBuffer,
                    arrayBufferToBase64: arrayBufferToBase64,
                    getIntDate: getIntDate,
                    operacaoNaoAutorizada: operacaoNaoAutorizada,
                    roles: roles
                };
            }]);
})();