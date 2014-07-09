function TodoCtrl($scope) {
    $scope.todos = [];
    $scope.add = function add() {
        $scope.todos.push({
            title: $scope.title,
            completed: false
        });
    };
    $scope.remove = function remove(index) {
        $scope.todos.splice(index, 1);
    };
}
