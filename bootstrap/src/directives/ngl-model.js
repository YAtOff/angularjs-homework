Provider.directive('ngl-model', function () {
    'use strict';
    return {
        scope: false,
        link: function (el, scope, exp) {
            el.onchange = function () {
                scope[exp] = el.value;
                scope.$digest();
            };
        }
    };
});
