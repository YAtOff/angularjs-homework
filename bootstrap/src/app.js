(function() {
    Provider.controller('TodoCtrl', function () {
        'use strict';
        return function(scope) {
            scope.todos = [
            ];
            scope.todo = '';
            scope.add = function() {
                scope.todos.push(scope.todo);
            };
        };
    });

    DOMCompiler.bootstrap();
})();
