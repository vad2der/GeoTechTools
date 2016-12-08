(function () {

if 	(document.getElementById("canvas")){
	var height = document.getElementById("canvas").clientHeight;
	var width = document.getElementById("canvas").clientWidth;

	var marg = height / 2;

	var input_positions = {1: [[0,0],[0,marg]],
						   2: [[width/4,0],[width/4,marg]],
						   3: [[width/2,0],[width/2,marg]],
						   4: [[width*3/4,0],[width*3/4,marg]],
						   5: [[width,0],[width,marg]]};

	d3.selectAll("svg").remove();

	var canvas = d3.select('#canvas')
	      .append('svg')
	      .attr({ width, height });

	var inputs = canvas.selectAll('input')
					.data(input_positions)
					.enter()
						.append('input')
						.attr('class','form-control')					
						.attr('x', d => d[0][0])
	    				.attr('y', d => d[0][1]);

}      

})();