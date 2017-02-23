(function () {
"use strict";

angular.module('utilities', ['public', 'ngMdIcons', 'ng-token-auth'])
.config(config)
.controller('AppCtrl', function() {
  this.currentNavItem = "Home";
})
.controller('UserSessionsCtrl', ['$scope', function ($scope) {
  $scope.$on('auth:login-error', function(ev, reason) {
      $scope.error = reason.errors[0];
  });
}]);

config.$inject = ['$urlRouterProvider', '$locationProvider', '$authProvider'];
function config($urlRouterProvider, $locationProvider, $authProvider) {
	//getting rid of # in route
//	$locationProvider.html5Mode(true);
  	// If user goes to a path that doesn't exist, redirect to public root
  	$urlRouterProvider.otherwise('/tools');

  	$authProvider.configure({
      apiUrl:                  '/api',
      tokenValidationPath:     '/auth/validate_token',
      signOutUrl:              '/auth/sign_out',
      emailRegistrationPath:   '/auth',
      accountUpdatePath:       '/auth',
      accountDeletePath:       '/auth',
      confirmationSuccessUrl:  window.location.href,
      passwordResetPath:       '/auth/password',
      passwordUpdatePath:      '/auth/password',
      passwordResetSuccessUrl: window.location.href,
      emailSignInPath:         '/auth/sign_in',
      storage:                 'cookies',
      forceValidateToken:      false,
      validateOnPageLoad:      true,
      proxyIf:                 function() { return false; },
      proxyUrl:                '/proxy',
      omniauthWindowType:      'sameWindow',
      authProviderPaths: {
        linkedin:   '/auth/linkedin'
      },
      tokenFormat: {
        "access-token": "{{ token }}",
        "token-type":   "Bearer",
        "client":       "{{ clientId }}",
        "expiry":       "{{ expiry }}",
        "uid":          "{{ uid }}"
      },
      cookieOps: {
        path: "/",
        expires: 3,
        expirationUnit: 'days',
        secure: true,
        domain: 'geothechtool.com'
      },
      createPopup: function(url) {
        return window.open(url, '_blank', 'closebuttoncaption=Cancel');
      },
      parseExpiry: function(headers) {
        // convert from UTC ruby (seconds) to UTC js (milliseconds)
        return (parseInt(headers['expiry']) * 1000) || null;
      },
      handleLoginResponse: function(response) {
        return response.data;
      },
      handleAccountUpdateResponse: function(response) {
        return response.data;
      },
      handleTokenValidationResponse: function(response) {
        return response.data;
      }
    });
  
}
})();