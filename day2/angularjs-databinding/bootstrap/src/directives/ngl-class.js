Provider.directive('ngl-class', function () {
    'use strict';
    return {
        scope: false,
        link: function (el, scope, exp) {
            var groups;
            // try object notation: {class: condition expression, ...}
            groups = exp.match(/{(.*)}/);
            if (groups) {
                groups = groups[1].match(/([^:]+):([^,]+),?/g);
                groups.map(function(g) {
                    return g.split(/\s*:\s*/);
                }).forEach(function(pair) {
                    var exp = pair[1],
                        watcher = function() {
                        var className = pair[0].trim(),
                            enabled = !!scope.$eval(exp);
                        if (enabled && !el.classList.contains(className)) {
                            el.classList.add(className);
                        } else if (!enabled && el.classList.contains(className)) {
                            el.classList.remove(className);
                        }
                    };

                    scope.$watch(exp, watcher);
                    watcher();
                });
            } else {
                // try array notation: [class expression, class expression, ...]
                groups = exp.match(/\[(.*)\]/);
                if (groups) {
                    groups[1].split(/\s*,\s*/).forEach(function(ce) {
                        var watcher = function() {
                            var className = scope.$eval(ce);
                            if (!el.classList.contains(className)) {
                                el.classList.add(className);
                            }
                        };

                        scope.$watch(ce, watcher);
                        watcher();
                    });
                } else {
                    // try simple expression
                    var watcher = function() {
                        var className = scope.$eval(exp);
                        if (!el.classList.contains(className)) {
                            el.classList.add(className);
                        }
                    };

                    scope.$watch(exp, watcher);
                    watcher();
                }
            }
        }
    };
});
