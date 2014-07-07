(function() {
    Provider.controller('TodoCtrl', function () {
        'use strict';
        return function(scope) {
            scope.todos = [
            ];
            scope.todo = {text: '', isDone: false};
            scope.add = function() {
                scope.todos.push({text: scope.todo.text, isDone: false});
            };
        };
    });

    DOMCompiler.bootstrap();
})();
