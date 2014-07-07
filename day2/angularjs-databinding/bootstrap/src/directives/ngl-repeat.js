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
                groups, i,
                watcher = function() {
                    // remove existing elements
                    while (parent.firstChild) {
                        parent.removeChild(parent.firstChild);
                    }
                    // for every item
                    items = scope.$eval(itemsExp);
                    for (i = 0; i < items.length; i += 1) {
                        // add node to parent
                        itemElement = itemElementTemplate.cloneNode(true);
                        parent.appendChild(itemElement);
                        // create new scope
                        newScope = scope.$new();
                        // put item in it
                        newScope[itemName] = items[i];
                        newScope.$watch(itemsExp, watcher);
                        // compile node with new scope
                        DOMCompiler.compile(itemElement, newScope);
                    }
                };

            // clone this node without ngl-repeat
            itemElementTemplate = el.cloneNode(true);
            itemElementTemplate.removeAttribute('ngl-repeat');
            // get item and items parts
            groups = exp.match(/([a-zA-Z_$][0-9a-zA-Z_$]*)\s+in\s+(.*)/);
            if (!!groups) {
                itemName = groups[1];
                itemsExp = groups[2];
                // add watch for items
                scope.$watch(itemsExp, watcher);
                watcher();
            }
        }
    };
});

