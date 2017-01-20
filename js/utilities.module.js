(function () {
"use strict";

angular.module('utilities', ['public', 'ngMdIcons'])
.config(config)
.controller('AppCtrl', function() {
  this.currentNavItem = "Home";
});

config.$inject = ['$urlRouterProvider', '$locationProvider'];
function config($urlRouterProvider, $locationProvider) {
	//getting rid of # in route
//	$locationProvider.html5Mode(true);
  	// If user goes to a path that doesn't exist, redirect to public root
  	$urlRouterProvider.otherwise('/tools');
}	
})();