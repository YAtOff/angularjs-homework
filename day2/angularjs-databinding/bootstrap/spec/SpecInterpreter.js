describe('Interpreter specification', function() {

    it('evals expressions', function() {
        var ctx = {
            foo: 1,
            bar: function(baz) {
                return baz + 1;
            }
        };
        evaluate('foo = bar(foo)', ctx);
        expect(ctx.foo).toEqual(2);
    });

    it('does property lookup', function() {
        var ctx = {
            foo: {
                bar: 'baz'
            }
        };
        expect(evaluate('foo.bar', ctx)).toEqual('baz');
    });

    it('applies simple filters', function() {
        Provider.filter('positive', function() {
            return function(vals) {
                return vals.filter(function(v) {
                    return 0 <= v;
                });
            };
        });

        var ctx = {
            foo: [1, -1, 2]
        };

        expect(Provider.get('positiveFilter')(ctx.foo)).toEqual([1, 2]);
        expect(evaluate('foo | positive', ctx)).toEqual([1, 2]);
    });
});
