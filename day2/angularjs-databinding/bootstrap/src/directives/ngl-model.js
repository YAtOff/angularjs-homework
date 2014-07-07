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
                model[parts[parts.length - 1]] = el.value;
                scope.$digest();
            };
        }
    };
});
