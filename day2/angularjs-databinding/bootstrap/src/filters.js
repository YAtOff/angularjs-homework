Provider.filter('pending', function() {
    return function(vals) {
        return vals.filter(function(v) {
            return v.completed === 'off' || v.completed === false;
        });
    };
});
