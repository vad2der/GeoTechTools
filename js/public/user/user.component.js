(function () {
'use strict';

angular.module('public')
.component('userComponent', {
  templateUrl: 'templates/public/user/user.html'
})
.controller('UserSessionsCtrl', ['$scope', function ($scope) {
  $scope.$on('auth:login-error', function(ev, reason) {
      $scope.error = reason.errors[0];
  });
}]);

})();