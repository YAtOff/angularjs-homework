var Scope = function(id, parent) {
    'use strict';
    this.$$watchers = [];
    this.$$children = [];
    this.$parent = parent;
    this.$id = id || 0;
};
Scope.counter = 0;

Scope.prototype.$eval = function(exp) {
    'use strict';
    return evaluate(exp, this);
};

Scope.prototype.$watch = function(exp, fn) {
    'use strict';
    this.$$watchers.push({
        exp: exp,
        fn: fn,
        last: Utils.clone(this.$eval(exp))
    });
};

Scope.prototype.$new = function() {
    'use strict';
    var scope;
    Scope.counter += 1;
    scope = Object.create(this);
    Scope.call(scope,Scope.counter, this); 
    this.$$children.push(scope);
    return scope;
};

Scope.prototype.$destroy = function() {
    'use strict';
    this.parent.$$children.splice(this.parent.$$children.indexOf(this), 1);
};

Scope.prototype.$digest = function() {
    'use strict';
    var durty = true,
        watcher, expResult;
    while (durty) {
        durty = false;
        for (var i = 0; i < this.$$watchers.length; i += 1) {
            watcher = this.$$watchers[i];
            expResult = this.$eval(watcher.exp);
            if (!Utils.equals(expResult, watcher.last)) {
                durty = true;
                watcher.last = Utils.clone(expResult);
                watcher.fn();
            }
        }
    }
};
