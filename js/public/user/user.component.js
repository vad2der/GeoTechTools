(function () {
'use strict';

angular.module('public')
.component('userComponent', {
  templateUrl: 'templates/public/user/user.html'
})
.controller('RightCtrl', RightCtrl);

RightCtrl.$inject = ['$scope', '$timeout', '$mdSidenav', '$log', '$auth'];
function RightCtrl($scope, $timeout, $mdSidenav, $log, $auth) {
    $scope.close = function () {
      // Component lookup should always be available since we are not using `ng-if`
      $mdSidenav('right').close()
        .then(function () {
          $log.debug("close RIGHT is done");
        });
    };

    $scope.handleBtnClick = function(param) {
      $auth.authenticate(param)
        .then(function(resp) {
          // handle success
        })
        .catch(function(resp) {
          // handle errors
        });
    };
};

})();