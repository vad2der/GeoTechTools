(function() {
'use strict';

angular.module('public')
.config(routeConfig);

/**
 * Configures the routes and views
 */
routeConfig.$inject = ['$stateProvider'];
function routeConfig ($stateProvider) {
  // Routes
  $stateProvider
    .state('public', {
      absract: true,
      templateUrl: 'templates/public/public.html'
    })      
    // .state('public.home', {
    //   url: '/',
    //   templateUrl: 'templates/public/tools.html'
    // })
     .state('public.tools', {
      url: '/tools',
      templateUrl: 'templates/public/tools/tools-component.html'
    })
    .state('public.sag', {
      url: '/tools/sag',
      templateUrl: 'templates/public/sag/sag-component.html'
    })
    .state('public.about', {
      url: '/about',
      templateUrl: 'templates/public/about.html'
    })
    .state("otherwise", {
      url: "*path",
      templateUrl: 'templates/public/tools/tools-component.html'//"templates/public/error-not-found.html"
    });
}

})();
