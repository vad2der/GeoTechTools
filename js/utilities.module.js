(function () {
"use strict";

angular.module('utilities', ['public', 'ngMdIcons'])
.config(config)
.controller('AppCtrl', function() {
  this.currentNavItem = "Home";
});

config.$inject = ['$urlRouterProvider'];
function config($urlRouterProvider) {

  // If user goes to a path that doesn't exist, redirect to public root
  $urlRouterProvider.otherwise('/');
}	
})();