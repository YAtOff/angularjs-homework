/* global TodoApp */

(function (TodoApp, window) {
    'use strict';
    TodoApp.controller('TodoCtrl', ['$scope', 'Todo', function TodoCtrl($scope, Todo) {
        $scope.todos = Todo.getList();
        $scope.add = function add() {
            var todo = new Todo({
                title: $scope.todoTitle,
                date: new window.Date()
            });
            todo.save();
            $scope.todos = Todo.getList();
            $scope.todoTitle = '';
        };
        $scope.remove = function remove(todo) {
            todo.destroy();
            $scope.todos = Todo.getList();
        };
    }]);
}(TodoApp, window));

