(function () {

if 	(document.getElementById("canvas")){
	
	document.getElementById("canvas").style.width=window.innerWidth*0.8;
	document.getElementById("canvas").style.height=window.innerHeight*0.5;

	var height = document.getElementById("canvas").clientHeight;
	var width = document.getElementById("canvas").clientWidth;

	var marg = height / 2;

	var inputPositions = {1: [[0,0],[0,marg]],
						   2: [[width/4,0],[width/4,marg]],
						   3: [[width/2,0],[width/2,marg]],
						   4: [[width*3/4,0],[width*3/4,marg]],
						   5: [[width,0],[width,marg]]};

	d3.selectAll("svg").remove();

	var canvas = d3.select('#canvas')
	      .append('svg')
	      .attr({ width, height });

}      

})();