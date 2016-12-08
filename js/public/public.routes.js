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
      templateUrl: 'src/public/public.html'
    })
    .state('public.home', {
      url: '/',
      templateUrl: 'templates/public/home.html'
    })
    .state('public.sag', {
      url: '/sag',
      templateUrl: 'templates/public/sag/sag.html',
      controller: 'SagController',
      controllerAs: 'sagCtrl',
      // resolve: {
      //   menuCategories: ['MenuService', function (MenuService) {
      //     return MenuService.getCategories();
      //   }]
      // }
    });
}
})();
