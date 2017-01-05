(function () {
"use strict";

angular.module('public')
.controller('TableViewController', TableViewController);

TableViewController.$inject = ['TableViewService', '$scope'];
function TableViewController(TableViewService, $scope) {
	var tvCtrl = this;

	$scope.$watch(TableViewService.changed, function(){
		tvCtrl.tableContent = TableViewService.getTable();
		console.log(tvCtrl.tableContent);
		$scope.$digest();
	});
}
})(window);
