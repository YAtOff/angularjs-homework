var DOMCompiler = (function() {
    'use strict';

    return {
        bootstrap: function() {
            this.compile(document.body, Provider.get('rootScope'));
        },
        compile: function(el, scope) {
            var directives = [],
                attrName, attrVal,
                newScope = scope,
                directive,
                k, i,
                elementAttributes = el.attributes || [],
                elementChildNodes = el.childNodes || [];

            for (k in Provider._providers) if (Provider._providers.hasOwnProperty(k)) {
                if (k.indexOf(Provider.DIRECTIVES_SUFFIX,
                                     k.length - Provider.DIRECTIVES_SUFFIX.length) !== -1) {
                    directives.push(k);
                }
            }

            for (i = 0; i < elementAttributes.length; i += 1) {
                directiveName = elementAttributes[i].name + Provider.DIRECTIVES_SUFFIX;
                exp = elementAttributes[i].value;
                if (directives.indexOf(directiveName) !== -1) {
                    directive = Provider.get(directiveName);
                    if (directive.scope) {
                        newScope = scope.$new();
                        directive.link.call(null, el, newScope, exp);
                    } else {
                        directive.link.call(null, el, scope, exp);
                    }
                }
            }

            for (i = 0; i < elementChildNodes.length; i += 1) {
                this.compile(elementChildNodes[i], newScope);
            }
        }
    };
})();
