(function () {
'use strict';

angular.module('public')
.component('userComponent', {
  templateUrl: 'templates/public/user/user.html'
})
.controller('RightCtrl', RightCtrl);

RightCtrl.$inject = ['$scope', '$timeout', '$mdSidenav', '$log'];
function RightCtrl($scope, $timeout, $mdSidenav, $log) {
    $scope.close = function () {
      // Component lookup should always be available since we are not using `ng-if`
      $mdSidenav('right').close()
        .then(function () {
          $log.debug("close RIGHT is done");
        });
    };
};

})();