(function () {
"use strict";

angular.module('public')
.service('TableViewService', TableViewService);

function TableViewService() {
	const service = this;
	service.changed = false;

	service.setTable = function(rows){
		service.tableContent = rows;
		console.log("table set");
		service.changed = !service.changed;
	};
	service.getTable = function(){
		console.log("table got");
		console.log(service.tableContent);
		return service.tableContent;
	};
}
})(window);
