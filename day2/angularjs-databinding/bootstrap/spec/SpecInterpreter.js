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
});
