(function () {
"use strict";

angular.module('public')
.controller('MenuController', MenuController)
.controller('UserRegistrationsCtrl', UserRegistrationsCtrl);

MenuController.$inject = ['$scope', '$timeout', '$mdSidenav'];
function MenuController($scope, $timeout, $mdSidenav) {
	let ctrl = this;
	ctrl.loggedin = false;
	ctrl.fullName = null;
  	$scope.toggleSidenav = function(menuId) {
    	$mdSidenav(menuId).toggle();
  	};

    $scope.toggleLeft = buildDelayedToggler('left');
    $scope.toggleRight = buildToggler('right');

    $scope.isOpenRight = function(){
      return $mdSidenav('right').isOpen();
    };

    $scope.close = function () {
      // Component lookup should always be available since we are not using `ng-if`      
      $mdSidenav('left').close()
        .then(function () {
          //$log.debug("right is closed");
        });
    };
    /**
     * Supplies a function that will continue to operate until the
     * time is up.
     */
    function debounce(func, wait, context) {
      var timer;

      return function debounced() {
        var context = $scope,
            args = Array.prototype.slice.call(arguments);
        $timeout.cancel(timer);
        timer = $timeout(function() {
          timer = undefined;
          func.apply(context, args);
        }, wait || 10);
      };
    }

    /**
     * Build handler to open/close a SideNav; when animation finishes
     * report completion in console
     */
    function buildDelayedToggler(navID) {
      return debounce(function() {
        // Component lookup should always be available since we are not using `ng-if`
        $mdSidenav(navID)
          .toggle()
          .then(function () {
            //$log.debug("toggle " + navID + " is done");
          });
      }, 200);
    }

    function buildToggler(navID) {
      return function() {
        // Component lookup should always be available since we are not using `ng-if`
        $mdSidenav(navID)
          .toggle()
          .then(function () {
            //$log.debug("toggle " + navID + " is done");
          });
      };
    }
};

UserRegistrationsCtrl.$inject = ['$scope', '$location', '$auth'];
function UserRegistrationsCtrl($scope, $location, $auth) {
  $scope.handleRegBtnClick = function() {
    console.log("Registration clicked");
    $auth.submitRegistration($scope.registrationForm)
      .then(function() { 
        $auth.submitLogin({
          email: $scope.registrationForm.email,
          password: $scope.registrationForm.password
        });
      });
  };
  
  $scope.$on('auth:registration-email-error', function(ev, reason) {
    $scope.error = reason.errors[0];
  });
};

})(window);
