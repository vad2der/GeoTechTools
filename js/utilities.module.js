(function () {
"use strict";

angular.module('utilities', ['public', 'ngMdIcons', 'ng-token-auth'])
.config(config)
.controller('AppCtrl', function() {
  this.currentNavItem = "Home";
})
.controller('RightCtrl', function ($scope, $timeout, $mdSidenav, $log) {
    $scope.close = function () {
      // Component lookup should always be available since we are not using `ng-if`
      $mdSidenav('right').close()
        .then(function () {
          $log.debug("close RIGHT is done");
        });
    };
  });

config.$inject = ['$urlRouterProvider', '$locationProvider', '$authProvider'];
function config($urlRouterProvider, $locationProvider, $authProvider) {
	//getting rid of # in route
//	$locationProvider.html5Mode(true);
  	// If user goes to a path that doesn't exist, redirect to public root
  	$urlRouterProvider.otherwise('/tools');
}
})();