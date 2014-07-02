var Provider = (function() {
    'use strict';

    return {
        _providers: {},
        _cache: {
            rootScope: new Scope(0, null),
        },
        _register: function(fn, name) {
            this._providers[name] = fn;
        },
        get: function(name, locals) {
            if (name in this._cache) {
                return this._cache[name];
            } else {
                this._cache[name] = this.invoke(this._providers[name], locals);
                return this._cache[name];
            }
        },
        directive: function(name, fn) {
            this._register(fn, name + this.DIRECTIVES_SUFFIX);
        },
        controller: function(name, fn) {
            this._register(fn, name + this.CONTROLLERS_SUFFIX);
        },
        service: function(name, fn) {
            this._register(fn, name);
        },
        annotate: function(fn) {
            var FN_ARGS = /^function\s*[^\(]*\(\s*([^\)]*)\)/m,
                FN_ARG_SPLIT = /,/,
                FN_ARG = /^\s*(_?)(\S+?)\1\s*$/,
                STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg,
                args = [],
                fnText, argDecl;

            fnText = fn.toString().replace(STRIP_COMMENTS, '');
            argDecl = fnText.match(FN_ARGS);
            argDecl[1].split(FN_ARG_SPLIT).forEach(function(arg) {
                arg.replace(FN_ARG, function(all, underscore, name) {
                    args.push(name);
                });
            });
            return args;
        },
        invoke: function(fn, locals) {
            var self = this,
                locals = locals || {},
                params = this.annotate(fn),
                args = params.map(function(param) {
                    if (param in locals) {
                        return locals[param];
                    } else {
                        return self.get(param, locals);
                    }
                });
                return fn.apply(null, args);
        },
        DIRECTIVES_SUFFIX: "Directive",
        CONTROLLERS_SUFFIX: "Controller"
    };
})();

// (function() {
//     var newTwo = function() {
//         console.log('New function Two');
//     };

//     Provider.service('One', function One(Two, Three) {
//         return function() {
//             console.log('function One');
//             Two();
//             Three();
//         };
//     });
//     Provider.service('Two', function Two() {
//         return function() {
//             console.log('function Two');
//         };
//     });
//     Provider.service('Three', function Three() {
//         return function() {
//             console.log('function Three');
//         };
//     });
//     Provider.get('One', {Two: newTwo})();
// })();


(function() {
    Provider.service('ScopeTest', function ScopeTest(rootScope) {
        return function() {
            var parent = rootScope.$new(),
                child = parent.$new();

            parent.foo = 'foo';
            parent.bar = 'bar';
            parent.foobar = function() {
                return 'in parent';
            };
            child.bar = 'childbar';
            child.foobar = function() {
                return 'in child';
            };

            console.log('parent.foo: ' + parent.$eval('foo'));
            console.log('parent.bar: ' + parent.$eval('bar'));
            console.log('parent.foobar(): ' + parent.$eval('foobar()'));
            console.log('child.foo: ' + child.$eval('foo'));
            console.log('child.bar: ' + child.$eval('bar'));
            console.log('child.foobar(): ', child.$eval('foobar()'));

            child.$watch('foo', function () {
                console.log('foo changed');
            });

            child.foo = 'foofoo';
            child.$digest();
        };
    });

    Provider.get('ScopeTest')();
})();
