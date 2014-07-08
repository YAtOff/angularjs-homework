Provider.directive('ngl-model', function () {
    'use strict';
    return {
        scope: false,
        link: function (el, scope, exp) {
            el.onchange = function () {
                var parts = exp.split('.'),
                    model = scope,
                    i;
                for (i = 0; i < parts.length - 1; i += 1) {
                    model = model[parts[i]];
                }
                model[parts[parts.length - 1]] = el.type === 'checkbox'? el.checked : el.value;
                scope.$digest();
            };
            scope.$watch(exp, function() {
                if (el.type === 'checkbox') {
                    el.checked = scope.$eval(exp);
                } else {
                    el.value = scope.$eval(exp);
                }
            });
        }
    };
});
