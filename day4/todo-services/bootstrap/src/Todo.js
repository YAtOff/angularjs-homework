/* global TodoApp */

(function (TodoApp) {
    'use strict';

    TodoApp.factory('Todo', ['storage', function (storage) {
        var todos = (storage.get('todos') || []).map(function (data) {
            return new Todo(data);
        });

        function Todo(data) {
            this.title = data.title;
            this.date = data.date;
            this.id = data.id;
        };

        Todo.prototype.save = function save() {
            todos.push(this);
            this.id = todos.indexOf(this);
            storage.put('todos', todos);
        };

        Todo.prototype.destroy = function destroy() {
            todos.splice(todos.indexOf(this), 1);
            storage.put('todos', todos);
        };

        Todo.getList = function getList() {
            return todos.map(function (todo, i) {
                return new Todo({
                    title: todo.title,
                    id: i,
                    data: todo.data
                });
            });
        };

        return Todo;
    }]);

}(TodoApp));
