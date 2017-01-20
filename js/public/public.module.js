(function() {
"use strict";
/**
 * Public application. Includes the ui-router.
 */
angular.module('public', ['ui.router', 'ngMaterial', 'ngMessages'])
.config(config);

config.$inject = ['$mdThemingProvider','$urlRouterProvider', '$locationProvider'];
function config($mdThemingProvider, $urlRouterProvider, $locationProvider) {
  $mdThemingProvider.theme('default')
    .primaryPalette('grey')
    .accentPalette('light-blue');

    	//getting rid of # in route
	$locationProvider.html5Mode(true);
  	// If user goes to a path that doesn't exist, redirect to public root
  	$urlRouterProvider.otherwise('/tools');
}	

})();
