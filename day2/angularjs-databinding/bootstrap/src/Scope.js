var Scope = (function() {
    'use strict';

    var Scope = function(id, parent) {
        this.$$watchers = [];
        this.$$children = [];
        this.$parent = parent;
        this.$id = id || 0;
        this.$$topics = {};
    };
    Scope.counter = 0;

    Scope.prototype.$eval = function(exp) {
        return evaluate(exp, this);
    };

    Scope.prototype.$watch = function(exp, fn) {
        this.$$watchers.push({
            exp: exp,
            fn: fn,
            last: Utils.clone(this.$eval(exp))
        });
    };

    Scope.prototype.$new = function() {
        var scope;
        Scope.counter += 1;
        scope = Object.create(this);
        Scope.call(scope, Scope.counter, this); 
        this.$$children.push(scope);
        return scope;
    };

    Scope.prototype.$destroy = function() {
        this.parent.$$children.splice(this.parent.$$children.indexOf(this), 1);
    };

    Scope.prototype.$digest = function() {
        var durty = true,
            watcher, expResult,
            i;
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

        for (i = 0; i < this.$$children.length; i += 1) {
            this.$$children[i].$digest();
        }
    };

    Scope.prototype.$$publish = function(topic, data) {
        var event = {topic: topic, stopPropagation: false};
        if (!this.$$topics[topic]) {
            return false;
        }
        var subscribers = this.$$topics[topic],
            len = subscribers ? subscribers.length : 0;
        while (len--) {
            subscribers[len](event, data);
        }
        return !event.stopPropagation;
    };

    Scope.prototype.$broadcast = function(topic, data) {
        var i;
        if (this.$$publish(topic, data)) {
            for (i = 0; i < this.$$children.length; i += 1) {
                this.$$children[i].$broadcast(event, data);
            }
        }
    };

    Scope.prototype.$emit = function(topic, data) {
        if (this.$$publish(topic, data)) {
            this.$parent.$emit(topic, data);
        }
    };

    Scope.prototype.$on = function(topic, callback) {
        if (!this.$$topics[topic]) {
            this.$$topics[topic] = [];
        }
        this.$$topics[topic].push(callback);
        return this;
    };

    return Scope;
})();
