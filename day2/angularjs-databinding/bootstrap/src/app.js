(function() {
    Provider.controller('TodoCtrl', function ($scope) {
        'use strict';
        $scope.todos = [
        ];
        $scope.todo = {title: '', completed: false};
        $scope.add = function() {
            $scope.todos.push({title: $scope.todo.title, completed: false});
        };
    });

    DOMCompiler.bootstrap();
})();
