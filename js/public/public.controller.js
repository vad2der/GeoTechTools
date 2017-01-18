(function () {
"use strict";

angular.module('public')
.controller('MenuController', MenuController);

MenuController.$inject = ['$scope', '$mdSidenav'];
function MenuController($scope, $mdSidenav) {
	
  $scope.toggleSidenav = function(menuId) {
    $mdSidenav(menuId).toggle();
  };

	
}
})(window);
