/* global TodoApp, localStorage */

(function (TodoApp, localStorage) {
    'use strict';

    TodoApp.provider('storage', function storage() {
        var keyName = 'todos';

        this.setKey = function setKey(key) {
            keyName = key;
        };
        this.$get = function $get() {
            var data = JSON.parse(localStorage.getItem(keyName)) || {};

            return {
                put: function put(key, value) {
                    data[key] = value;
                    localStorage.setItem(keyName, JSON.stringify(data));
                },
                get: function get(key) {
                    return data[key];
                }
            };
        };
    });
}(TodoApp, localStorage));
