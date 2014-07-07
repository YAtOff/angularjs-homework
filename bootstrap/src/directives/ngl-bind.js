Provider.directive('ngl-bind', function () {
    'use strict';
    return {
        scope: false,
        link: function (el, scope, exp) {
            scope.$watch(exp, function () {
                el.textContent = scope.$eval(exp);
            }); 
            el.textContent = scope.$eval(exp);
        }
    };
});
