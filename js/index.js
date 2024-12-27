var app = angular.module("app", []);

app.controller("neon", function ($scope, $element) {
  var _name = "🎉HBD QUOKKA🎉";
  $scope.user = {
    name: function (newName) {
      return arguments.length ? (_name = newName) : _name;
    },
  };

  $scope.color = "blue"; // 초기 색상을 'blue'로 고정합니다.

  $scope.getColor = function (color) {
    $scope.color = color;
  };
});
