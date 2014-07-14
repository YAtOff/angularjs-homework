/* global TodoApp */

(function (TodoApp) {
    'use strict';
    TodoApp.factory('Todo', function ($http) {
        var todos = [];

        function Todo(data) {
            this.id = data.id;
            this.title = data.title;
            this.created = data.created;
            this.until = data.until;
        }

        Todo.get = function get(id) {
            return $http({
                method: 'get',
                url: '/todo/' + id
            }).then(function (data) {
                return new Todo(data.data);
            });
        };

        Todo.getList = function getList() {
            return $http({
                method: 'get',
                url: '/todo'
            }).then(function (data) {
                return data.data.map(function (d) {
                    return new Todo(d);
                });
            });
        };

        Todo.prototype.save = function save() {
            var self = this;
            $http({
                method: 'post',
                url: '/todo',
                data: {
                    title: this.title,
                    created: this.created,
                    until: this.until,
                }
            }).success(function (data, status, headers, config) {
                self.id = data.id;
            })
            .error(function (data, status, headers, config) {
            });
        };

        Todo.prototype.destroy = function destroy() {
            $http({
                method: 'delete',
                url: '/todo/' + this.id
            }).success(function (data, status, headers, config) {
                todos.splice(todos.indexOf(this), 1);
            })
            .error(function (data, status, headers, config) {
            });
        };

        Todo.getList().then(function (t) {
            todos = t;
        });

        return Todo;
    });
}(TodoApp));


