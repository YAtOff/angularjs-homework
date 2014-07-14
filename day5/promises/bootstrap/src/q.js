(function(window) {
    var STATES = {
        CLEAN: 0,
        RESOLVED: 1,
        REJECTED: 2
    };

    function Promise() {
        this._done = [];
        this._fail = [];
        this._state = STATES.CLEAN;
        this._resolveData = null;
        this._rejectData = null;
    }

    Promise.prototype.done = function done(cb) {
        this._done.push(cb);
        if (this._state === STATES.RESOLVED) {
            cb.call(null, this._resolveData);
        }
        return this;
    };

    Promise.prototype.fail = function fail(cb) {
        this._fail.push(cb);
        if (this._state === STATES.REJECTED) {
            cb.call(null, this._rejectData);
        }
        return this;
    };

    function Deferred() {
        this.promise = new Promise();
    }

    Deferred.prototype.resolve = function resolve(data) {
        if (this.promise._state !== STATES.CLEAN) {
            throw new Error('Promise is not "clean"!');
        } else {
            this.promise._state = STATES.RESOLVED;
            this.promise._resolveData = data;
            this.promise._done.forEach(function (cb) {
                cb.call(null, data);
            });
        }
    };

    Deferred.prototype.reject = function reject(data) {
        if (this.promise._state !== STATES.CLEAN) {
            throw new Error('Promise is not "clean"!');
        } else {
            this.promise._state = STATES.REJECTED;
            this.promise._rejectData = data;
            this.promise._fail.forEach(function (cb) {
                cb.call(null, data);
            });
        }
    };

    window.Q = {
        defer: function defer() {
            return new Deferred();
        },
        all: function all(promises) {
            var d = new Deferred();
            promises.forEach(function (p) {
                p.done(function done(data) {
                    var allResolved = promises.every(function (p) {
                        return p._status === STATES.RESOLVED;
                    });
                    if (allResolved) {
                        d.resolve(promises.map(function (p) {
                            return p._resolveData;
                        }));
                    }
                }).fail(function fail(data) {
                    if (d.promise._state === STATES.CLEAN) {
                        d.reject(p._rejectData);
                    }
                });
            });
            return d.promise;
        },
        when: function when(data) {
            var d = new Deferred();
            d.resolve(data);
            return d.promise;
        }
    };
})(window);
