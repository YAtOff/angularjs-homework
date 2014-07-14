/* global TodoApp */

(function (TodoApp) {
  'use strict';
  TodoApp.controller('TodoCtrl', function TodoCtrl($scope, Todo) {
      Todo.getList().then(function (todos) {
          $scope.todos = todos;
      });
      $scope.add = function add() {
          var todo = new Todo({
              title: $scope.todoTitle,
              created: new Date(),
              until: Date($scope.todoDate + '/' + $scope.todoTime)
          });
          todo.save();
          $scope.todos.push(todo);
          $scope.todoTitle = '';
          $scope.todoDate = '';
          $scope.todoTime = '';
      };
      $scope.remove = function remove(todo) {
          todo.destroy();
          $scope.todos.splice($scope.todos.indexOf(todo), 1);
      };
      $scope.details = function details(todo) {
          Todo.get(todo.id).then(function (todo) {
            $scope.todo = todo;
          });
      };
  });
}(TodoApp));

