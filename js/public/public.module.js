(function() {
"use strict";
/**
 * Public application. Includes the ui-router.
 */
angular.module('public', ['ui.router', 'ngMaterial', 'ngMessages', 'ngAnimate', 'ngAria', 'Spinner'])
.config(config);

config.$inject = ['$mdThemingProvider','$urlRouterProvider', '$locationProvider'];
function config($mdThemingProvider, $urlRouterProvider, $locationProvider) {
  $mdThemingProvider.theme('default')
    .primaryPalette('grey')
    .accentPalette('light-blue');

    	//getting rid of # in route
	// $locationProvider.html5Mode(true);
  	// If user goes to a path that doesn't exist, redirect to public root
  	
  	$urlRouterProvider.otherwise('/#/tools');
}	

/**
 * detect IE
 * returns version of IE or false, if browser is not Internet Explorer
 */
function detectIE() {
    var ua = window.navigator.userAgent;

    var msie = ua.indexOf('MSIE ');
    if (msie > 0) {
        // IE 10 or older => return version number
        return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
    }

    var trident = ua.indexOf('Trident/');
    if (trident > 0) {
        // IE 11 => return version number
        var rv = ua.indexOf('rv:');
        return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
    }

    var edge = ua.indexOf('Edge/');
    if (edge > 0) {
       // Edge (IE 12+) => return version number
       return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
    }

    // other browser
    return false;
}
if (detectIE()){$('#browserWarning').show();}

})();
