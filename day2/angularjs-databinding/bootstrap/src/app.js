(function() {
    Provider.controller('TodoCtrl', function ($scope) {
        'use strict';
        $scope.todos = [
        ];
        $scope.todo = {title: '', completed: false};
        $scope.add = function() {
            $scope.todos.push({title: $scope.todo.title, completed: false});
        };
        $scope.remove = function(index) {
            $scope.todos.splice(index, 1);
        };

        $scope.redEnabled = true;
        $scope.blueEnabled = false;
        $scope.big = 'big';
        $scope.green = 'green';
    });

    DOMCompiler.bootstrap();
})();
