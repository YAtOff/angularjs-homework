describe('Scope specification', function() {

    Provider.service('ScopeEvalTest', function ScopeTest($rootScope) {
        return function() {
            var parent = $rootScope.$new(),
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

            expect(parent.$eval('foo')).toEqual('foo');
            expect(parent.$eval('bar')).toEqual('bar');
            expect(parent.$eval('foobar()')).toEqual('in parent');
            expect(child.$eval('foo')).toEqual('foo');
            expect(child.$eval('bar')).toEqual('childbar');
            expect(child.$eval('foobar()')).toEqual('in child');
        };
    });

    Provider.service('ScopeWatchTest', function ScopeWatchTest($rootScope) {
        return function() {
            var scope = $rootScope.$new();

            scope.foo = 'foo';
            scope.onFooChanged = function() {};
            spyOn(scope, 'onFooChanged');

            scope.$watch('foo', scope.onFooChanged);

            scope.foo = 'foofoo';
            scope.$digest();

            return scope;
        };
    });
    it('evals expressions', function() {
        Provider.get('ScopeEvalTest')();
    });

    it('watches expressions', function() {
        var scope = Provider.get('ScopeWatchTest')();
        expect(scope.onFooChanged).toHaveBeenCalled();

    });
});
