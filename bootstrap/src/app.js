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
            el.textContent = scope.$eval(exp);
        }
    };
});

Provider.directive('ngl-repeat', function () {
    'use strict';
    return {
        scope: false,
        link: function (el, scope, exp) {
            var parent = el.parentNode,
                itemElementTemplate,
                itemName, itemElement,
                itemsExp, items,
                newScope,
                groups, i;

            // clone this node without ngl-repeat
            itemElementTemplate = el.cloneNode();
            itemElementTemplate.removeAttribute('ngl-repeat');
            // get item and items parts
            groups = exp.match(/([a-zA-Z_$][0-9a-zA-Z_$]*)\s+in\s+(.*)/);
            if (!!groups) {
                itemName = groups[1];
                itemsExp = groups[2];
                // add watch for items
                scope.$watch(itemsExp, function() {
                    // remove existing elements
                    while (parent.firstChild) {
                        parent.removeChild(parent.firstChild);
                    }
                    // for every item
                    items = scope.$eval(itemsExp);
                    for (i = 0; i < items.length; i += 1) {
                        // add node to parent
                        itemElement = itemElementTemplate.cloneNode();
                        parent.appendChild(itemElement);
                        // create new scope
                        newScope = scope.$new();
                        // put item in it
                        newScope[itemName] = items[i];
                        // compile node with new scope
                        DOMCompiler.compile(itemElement, newScope);
                    }
                });
            }
        }
    };
});

Provider.controller('TodoCtrl', function () {
    'use strict';
    return function(scope) {
        scope.todos = [
        ];
        scope.todo = '';
        scope.add = function() {
            scope.todos.push(scope.todo);
        };
    };
});

DOMCompiler.bootstrap();
})();
