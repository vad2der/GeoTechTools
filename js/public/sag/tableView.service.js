(function () {
"use strict";

angular.module('public')
.service('TableViewService', TableViewService);

function TableViewService() {
	const service = this;
	service.setTable = function(rows){
		service.tableContent = rows;
		console.log("table set");
	};
	service.getTable = function(){
		console.log("table got");
		return service.tableContent;
	};
}
})(window);
