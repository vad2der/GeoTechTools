(function () {
"use strict";

angular.module('public')
.filter('chainageFilter', function(){
    //custom filter to represent a number in format like 0+001.2, where n=1.2321, len=1
	return function(n, len){
		len = parseInt(len, 10);
		if (isNaN(n) || isNaN(len)) {
            return n;
        } else if (parseFloat(n) < 1000 && parseFloat(n) >= 0){        	
        	return "0+"+"0".repeat(3-Math.floor(n).toString().length)+parseFloat(n).toFixed(len).toString();
        } else if (parseFloat(n) > -1000 && parseFloat(n) < 0){        	
        	return "-0+"+"0".repeat(3-Math.floor(Math.abs(n)).toString().length)+parseFloat(Math.abs(n)).toFixed(len).toString();
        }

	}
});

})(window);
