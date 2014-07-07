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

    Scope.prototype.$$publish = function(event, data) {
        if (!this.$$topics[event.topic]) {
            return false;
        }
        var subscribers = this.$$topics[event.topic],
            len = subscribers ? subscribers.length : 0;
        while (len--) {
            subscribers[len](event, data);
        }
    };

    Scope.prototype.$$getEvent = function(topic) {
        if (typeof topic === 'string') {
            return {topic: topic, stopPropagation: false}; 
        } else {
            return topic;
        }
    };

    Scope.prototype.$broadcast = function(topic, data) {
        var event = this.$$getEvent(topic),
            i;
        this.$$publish(event, data);
        for (i = 0; i < this.$$children.length; i += 1) {
            if (event.stopPropagation) {
                return;
            }
            this.$$children[i].$broadcast(event, data);
        }
    };

    Scope.prototype.$emit = function(topic, data) {
        var event = this.$$getEvent(topic);
        this.$$publish(event, data);
        if (!event.stopPropagation) {
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
