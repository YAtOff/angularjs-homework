Provider.directive('ngl-controller', function () {
    'use strict';
    return {
        scope: true,
        link: function (el, scope, exp) {
            var controller = Provider.get(exp + Provider.CONTROLLERS_SUFFIX);
            Provider.invoke(controller, {$scope: scope});
        }
    };
});
