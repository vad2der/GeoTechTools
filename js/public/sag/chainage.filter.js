(function () {
"use strict";

angular.module('public')
.filter('chainageFilter', function(){
	return function(n, len){
		len = parseInt(len, 10);
		if (isNaN(n) || isNaN(len)) {
            return n;
        } else if (parseFloat(n) < 100 && parseFloat(n) >= 0){        	
        	return "0+"+"0".repeat(3-parseFloat(n).toFixed(0).length)+parseFloat(n).toFixed(len);
        } else if (parseFloat(n) > -100 && parseFloat(n) < 0){        	
        	return "-0+"+"0".repeat(3-parseFloat(Math.abs(n)).toFixed(0).length)+Math.abs(parseFloat(n).toFixed(len));
        }

	}
});

})(window);
