(function () {
"use strict";

angular.module('public')
.controller('TableViewController', TableViewController);

TableViewController.$inject = ['TableViewService'];
function TableViewController(TableViewService) {
	var tvCtrl = this;
	tvCtrl.tableContent = TableViewService.getTable();
}
})(window);
