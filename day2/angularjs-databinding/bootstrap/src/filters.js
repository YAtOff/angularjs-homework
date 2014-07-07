Provider.filter('pending', function() {
    return function(vals) {
        return vals.filter(function(v) {
            return v.isDone === 'off' || v.isDone === false;
        });
    };
});
