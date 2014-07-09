/* global TodoApp */

(function (TodoApp) {
    'use strict';

    TodoApp.config(['$provide', function ($provide) {
        $provide.decorator('storage', ['$delegate', '$log', function ($delegate, $log) {
            var originalPut = $delegate.put;
            $delegate.put = function (key, value) {
                $log('Storing data in key', key, 'with value', value);
                originalPut.apply(this, arguments);
            };
        }]);
    }]);
}(TodoApp));
