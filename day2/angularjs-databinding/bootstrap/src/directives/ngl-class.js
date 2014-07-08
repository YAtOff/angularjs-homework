Provider.directive('ngl-class', function () {
    'use strict';
    return {
        scope: false,
        link: function (el, scope, exp) {
            var groups,
                classes = [],
                i, c;
            // try object notation: {class: condition expression, ...}
            groups = exp.match(/{(.*)}/);
            if (groups) {
                groups = groups[1].match(/([^:]+):([^,]+),?/g);
                classes = groups.map(function(g) {
                    return g.split(/\s*:\s*/);
                }).map(function(pair) {
                    return {
                        className: pair[0].trim(),
                        enabled: !!scope.$eval(pair[1])
                    };
                });
            } else {
                // try array notation: [class expression, class expression, ...]
                groups = exp.match(/\[(.*)\]/);
                if (groups) {
                    classes = groups[1].split(/\s*,\s*/).map(function(ce) {
                        return {
                            className: scope.$eval(ce),
                            enabled: true
                        };
                    });
                } else {
                    // try simple expression
                    classes = [
                        {
                            className: scope.$eval(exp),
                            enabled: true
                        }
                    ];
                }
            }

            for (i = 0; i < classes.length; i += 1) {
                c = classes[i];
                if (c.enabled && !el.classList.contains(c.className)) {
                    el.classList.add(c.className);
                } else if (!c.eanbled && el.classList.contains(c.className)) {
                    el.classList.remove(c.className);
                }
            }
        }
    };
});
