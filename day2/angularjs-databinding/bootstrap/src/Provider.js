var Provider = (function() {
    'use strict';

    return {
        _providers: {},
        _cache: {
            $rootScope: new Scope(0, null),
        },
        _register: function(name, fn) {
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
            this._register(name + this.DIRECTIVES_SUFFIX, fn);
        },
        controller: function(name, fn) {
            this._register(name + this.CONTROLLERS_SUFFIX, function () {
                return fn;
            });
        },
        filter: function(name, fn) {
            this._register(name + this.FILTER_SUFFIX, fn);
        },
        service: function(name, fn) {
            this._register(name, fn);
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
        DIRECTIVES_SUFFIX: 'Directive',
        CONTROLLERS_SUFFIX: 'Controller',
        FILTER_SUFFIX: 'Filter'
    };
})();
