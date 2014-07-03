(function() {
Provider.directive('ngl-click', function () {
    'use strict';
    return {
        scope: false,
        link: function (el, scope, exp) {
            el.onclick = function () {
                scope.$eval(exp);
                scope.$digest();
            };
        }
    };
});

Provider.directive('ngl-controller', function () {
    'use strict';
    return {
        scope: true,
        link: function (el, scope, exp) {
            var controller = Provider.get(exp + Provider.CONTROLLERS_SUFFIX);
            controller(scope);
        }
    };
});

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

Provider.directive('ngl-bind', function () {
    'use strict';
    return {
        scope: false,
        link: function (el, scope, exp) {
            scope.$watch(exp, function () {
                el.textContent = scope.$eval(exp);
            }); 
        }
    };
});

Provider.directive('ngl-repeat', function () {
    'use strict';
    return {
        scope: true,
        link: function (el, scope, exp) {
            // clone this node without ngl-repeat
            // get item and items parts
            // add watche for items with callback
                // remove existing items
                // for every item
                // add node to parent
                // create new scope
                // put item in it
                // compile node with new scope
        }
    };
});

Provider.controller('TodoCtrl', function () {
    'use strict';
    return function(scope) {
        scope.todo = 'TODO';
        scope.foo = function() {
            console.log('foo');
        };
    };
});

DOMCompiler.bootstrap();
})();
