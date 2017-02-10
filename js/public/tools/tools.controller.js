(function () {
"use strict";

angular.module('public')
.controller('ToolsController', ToolsController);

ToolsController.$inject = ['$scope'];
function ToolsController($scope) {
	$scope.currentNavItem = 'Tools';
}
})(window);