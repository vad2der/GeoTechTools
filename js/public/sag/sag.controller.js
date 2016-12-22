(function () {
"use strict";

angular.module('public')
.controller('SagController', SagController);

SagController.$inject = ['$scope'];
function SagController($scope) {
  var sagCtrl = this;
  var color = "red";
  var crossingType = "dl-crossing";

  sagCtrl.loadTestData = function(){
	  //test data --start
	  sagCtrl.AEl = 8;
	  sagCtrl.AQuatEl = 6.5;
	  sagCtrl.Midel = 6;
	  sagCtrl.BQuatEl = 6.5;
	  sagCtrl.BEl = 8;

	  sagCtrl.AGr = 2.1;
	  sagCtrl.AQuatGr = 2.2;
	  sagCtrl.Midgr = 2.1;
	  sagCtrl.BQuatGr = 2;
	  sagCtrl.BGr = 1.9;

	  sagCtrl.sp1 = 2;
	  sagCtrl.sp2 = 2;
	  sagCtrl.sp3 = 2;
	  sagCtrl.sp4 = 2;
	  //test data --end
	  color = "red";
	 }

	 sagCtrl.clearData = function(){
	 	d3.selectAll("svg").remove();
	  //test data --start
	  sagCtrl.AEl = null;
	  sagCtrl.AQuatEl = null;
	  sagCtrl.Midel = null;
	  sagCtrl.BQuatEl = null;
	  sagCtrl.BEl = null;

	  sagCtrl.AGr = null;
	  sagCtrl.AQuatGr = null;
	  sagCtrl.Midgr = null;
	  sagCtrl.BQuatGr = null;
	  sagCtrl.BGr = null;

	  sagCtrl.sp1 = null;
	  sagCtrl.sp2 = null;
	  sagCtrl.sp3 = null;
	  sagCtrl.sp4 = null;
	  //test data --end
	  $scope.sagElevationForm.$setUntouched();
	  $scope.sagSpanForm.$setUntouched();
	  $scope.grndElevationForm.$setUntouched();
	 }

  
  var width = 1200;//document.getElementById("canvas").clientWidth;
  var height = 400;//document.getElementById("canvas").clientHeight;
   //console.log(width, height);

  sagCtrl.drawDiagram = function(){
  	d3.selectAll("svg").remove();
  	const margin = 0.01*height;
  	var wire = [sagCtrl.AEl, sagCtrl.AQuatEl, sagCtrl.Midel, sagCtrl.BQuatEl, sagCtrl.BEl];
  	var ground = [sagCtrl.AGr, sagCtrl.AQuatGr, sagCtrl.Midgr, sagCtrl.BQuatGr, sagCtrl.BGr];
  	const yd = (Math.max.apply(null, wire) - Math.min.apply(null, ground));
  	const yScaleFactor = (height-2*margin)/yd; //units in height pixels  	
  	const xScaleFactor = (width-2*margin)/(sagCtrl.sp1+sagCtrl.sp2+sagCtrl.sp3+sagCtrl.sp4);
  	
  	var wirePoints = [{"x": 0, "y": sagCtrl.AEl},
  					  {"x": sagCtrl.sp1, "y": sagCtrl.AQuatEl},
  					  {"x": sagCtrl.sp1+sagCtrl.sp2, "y": sagCtrl.Midel},
  					  {"x": sagCtrl.sp1+sagCtrl.sp2+sagCtrl.sp3, "y": sagCtrl.BQuatEl},
  					  {"x": sagCtrl.sp1+sagCtrl.sp2+sagCtrl.sp3+sagCtrl.sp4, "y": sagCtrl.BEl}];

	var groundPoints = [{"x": 0, "y": sagCtrl.AGr},
  					 	{"x": sagCtrl.sp1, "y": sagCtrl.AQuatGr},
  					    {"x": sagCtrl.sp1+sagCtrl.sp2, "y": sagCtrl.Midgr},
  					    {"x": sagCtrl.sp1+sagCtrl.sp2+sagCtrl.sp3, "y": sagCtrl.BQuatGr},
  					    {"x": sagCtrl.sp1+sagCtrl.sp2+sagCtrl.sp3+sagCtrl.sp4, "y": sagCtrl.BGr}];

 //  	var x = d3.scale.linear()
 //    .range([width, 0]);    

 //  	var y = d3.scale.linear()
 //    .range([height, 0]);

	// var xAxis = d3.svg.axis()
 //    .scale(x)
 //    .orient("bottom");

	// var yAxis = d3.svg.axis()
 //    .scale(y)
 //    .orient("left");

	var lineFunction = d3.svg.line()
    					.x(d => d.x*xScaleFactor)
    					.y(d => height-2*margin-(d.y-Math.min.apply(null, ground))*yScaleFactor)
    					.interpolate("monotone");

	var svgContainer = d3.select("#canvas").append("svg")
    	.attr("width", width)
    	.attr("height", height)
    	.attr('class','svg-cont')
    	.on("mousemove", handleMouseMove)    	
    	.on("click", handleClick)
  			.append("g")
    		.attr("transform", "translate("+margin+","+margin+")")
    		.attr('class','g-cont');


    var wireLineGraph = svgContainer.append("path")
                            .attr("d", lineFunction(wirePoints))
                            .attr("stroke", "blue")
                            .attr("stroke-width", 2)
                            .attr("fill", "none")
    						.attr('class','wire');

	var groundLineGraph = svgContainer.append("path")
                            .attr("d", lineFunction(groundPoints))
                            .attr("stroke", "green")
                            .attr("stroke-width", 2)
                            .attr("fill", "none")
    						.attr('class','ground');

// additional geometry --starts
	
	var svgAuxillary = d3.selectAll("svg")
    	.attr("width", width)
    	.attr("height", height)
  			.append("g")
    		.attr("transform", "translate("+margin+","+margin+")");

// poles geomentry -starts
	var polesFunction = d3.svg.line()
    			.x(d => d.x*xScaleFactor)
    			.y(d => height-2*margin-(d.y-Math.min.apply(null, ground))*yScaleFactor)
    			.interpolate("linear");

    const poleA = [{"x": 0, "y": sagCtrl.AGr}, {"x": 0, "y": sagCtrl.AEl}];
    const poleB = [{"x": sagCtrl.sp1+sagCtrl.sp2+sagCtrl.sp3+sagCtrl.sp4, "y": sagCtrl.BGr}, {"x": sagCtrl.sp1+sagCtrl.sp2+sagCtrl.sp3+sagCtrl.sp4, "y": sagCtrl.BEl}];

	var PoleAGraph = svgAuxillary.append("g")
							.attr('class', 'poleA')
               				.append('path')
                            .attr("d", polesFunction(poleA))
                            .attr("stroke", "black")
                            .attr("stroke-width", 5)
                            .attr("fill", "none")                            
    						.attr('class','pole');

	var PoleBGraph = svgAuxillary.append("g")
							.attr('class', 'poleB')
							.append("path")
                            .attr("d", polesFunction(poleB))
                            .attr("stroke", "black")
                            .attr("stroke-width", 5)
                            .attr("fill", "none")
    						.attr('class','pole');

	var poleAcx = 0;
    var poleAcy = height-2*margin-((poleA[1].y-poleA[0].y)/2)*yScaleFactor;
    var poleAdy = poleA[1].y-poleA[0].y;

	d3.selectAll("g.poleA").append("text")
		.attr("x", poleAcx)
		.attr("y", poleAcy)
		.attr("text-anchor", "middle")
		.attr("alignment-baseline", "before-edge")
		.text(poleAdy)
		.attr("font-family", "Arial Black")
       	.attr("font-size", "1em")
       	.attr("fill", "grey")
        .attr("transform", "rotate(-90 "+poleAcx+", "+poleAcy+")");

    var poleBcx = (sagCtrl.sp1+sagCtrl.sp2+sagCtrl.sp3+sagCtrl.sp4)*xScaleFactor;
    var poleBcy = height-2*margin-((poleB[1].y-poleB[0].y)/2)*yScaleFactor;
    var poleBdy = poleB[1].y-poleB[0].y;

	d3.selectAll("g.poleB").append("text")
		.attr("x", poleBcx)
		.attr("y", poleBcy)
		.attr("text-anchor", "middle")
		.attr("alignment-baseline", "after-edge")
		.text(poleBdy)
		.attr("font-family", "Arial Black")
       	.attr("font-size", "1em")
       	.attr("fill", "grey")
        .attr("transform", "rotate(-90 "+poleBcx+", "+poleBcy+")");

//poles geomentry -ends	
//mid and 1/4 lines -starts
	const inner = [[{"x": sagCtrl.sp1, "y": sagCtrl.AQuatGr},{"x": sagCtrl.sp1, "y": sagCtrl.AQuatEl}],
				  [{"x": sagCtrl.sp1+sagCtrl.sp2, "y": sagCtrl.Midgr},{"x": sagCtrl.sp1+sagCtrl.sp2, "y": sagCtrl.Midel}],
				  [{"x": sagCtrl.sp1+sagCtrl.sp2+sagCtrl.sp3, "y": sagCtrl.BQuatGr},{"x": sagCtrl.sp1+sagCtrl.sp2+sagCtrl.sp3, "y": sagCtrl.BQuatEl}]];
	
	var innnerLinesFunction = d3.svg.line()
    			.x(d => d.x*xScaleFactor)
    			.y(d => height-2*margin-(d.y-Math.min.apply(null, ground))*yScaleFactor)
    			.interpolate("linear");

	var lineAsIsFunction = d3.svg.line()
    			.x(d => d.x)
    			.y(d => d.y)
    			.interpolate("linear");
	
	inner.forEach(function(unit, i){
		var i =svgAuxillary.append("g")
							.attr('class', 'aux-line')
               				.append('path')
                            .attr("d", polesFunction(unit))
                            .attr("stroke", "black")
                            .attr("stroke-dasharray", ("10,3"))
                            .attr("stroke-width", 1)
                            .attr("fill", "none")
    						.attr('class','inner-aux-line');
    	
    	var cx = unit[0].x*xScaleFactor;
    	var cy = height-2*margin-((unit[0].y+unit[1].y)/2-Math.min.apply(null, ground))*yScaleFactor
    	var dy = parseFloat(unit[1].y-unit[0].y).toFixed(2);

		d3.selectAll("g.aux-line").append("text")
		.attr("x", cx)
		.attr("y", cy)
		.attr("text-anchor", "middle")
		.attr("alignment-baseline", "after-edge")
		.text(dy)
		.attr("font-family", "Arial Black")
       	.attr("font-size", "1em")
       	.attr("fill", "grey")
        .attr("transform", "rotate(-90 "+cx+", "+cy+")");
	});		
// mid and 1/4 lines -ends
	
	// measurement lines -start
	var coordinates = [0, 0];
	var x, y;
	var custLineContainer;
	var line;
	var textX, textY;
	var measurement1, measurement2;
	var leftMeasurement, rightMeasurement;

  function handleMouseMove(d, i){        	
        	coordinates = d3.mouse(this);
			x = coordinates[0];
			y = coordinates[1];

			d3.selectAll('text.curr-label').remove();
			d3.selectAll('g.custom-verticals').remove();
			d3.selectAll('circle.circle-vertical-ground').remove();
			d3.selectAll('circle.circle-vertical-wire').remove();

			line = [{"x": x/xScaleFactor,
					 "y": 0},
					{"x": x/xScaleFactor,
					 "y": height}];
			custLineContainer = svgContainer
				.append("g")
				.attr('class', 'custom-verticals');

			custLineContainer
				.append("path")
                .attr("d", polesFunction(line))
                .attr("stroke", "red")
                .attr("stroke-width", 1)
                .attr("fill", "none")
    			.attr('class','custom-vertical');

    		if (x > margin && x < width - margin*2){
    			
				// intersection using Kevin Lindsey's library
				var pathEl = d3.select('path.wire').node();
				var intersectionEl;
				var pathGr = d3.select('path.ground').node();
				var intersectionGr;
				var custLine = d3.select('path.custom-vertical').node();

				var shape1 = new Path(pathEl);
				var linePath = new Path(custLine);
				var overlays1 = Intersection.intersectShapes(shape1, linePath);

				var shape2 = new Path(pathGr);			
				var overlays2 = Intersection.intersectShapes(shape2, linePath);			

				custLineContainer
				.selectAll('circle.circle-vertical-wire')
					.data(overlays1.points).enter()
				.append('circle')
				.attr('cx', d => d.x)
				.attr('cy', d => d.y)
				.attr('r',5)
				.attr("fill", "red")
				.attr('class','circle-vertical-wire');

				custLineContainer
				.selectAll('circle.circle-vertical-ground')
					.data(overlays2.points).enter()
				.append('circle')
				.attr('cx', d => d.x)
				.attr('cy', d => d.y)
				.attr('r',5)
				.attr("fill", "red")
				.attr('class','circle-vertical-ground');

				textX = (overlays2.points[0].x + overlays1.points[0].x)/2;
				textY = (overlays2.points[0].y + overlays1.points[0].y)/2;

				custLineContainer
				.append("text")
				.attr("x", textX)
				.attr("y", textY)
				.attr('class','curr-label')
				.text(parseFloat((overlays2.points[0].y - overlays1.points[0].y)/yScaleFactor).toFixed(2))
				.attr("text-anchor", "middle")
				.attr("alignment-baseline", "after-edge")
				.attr("transform", "rotate(-90 "+textX+", "+textY+")");

				measurement1 = [{"x": 0, "y": (height*.9)},
									{"x": x, "y": (height*.9)}];

				measurement2 = [{"x": width, "y": (height*.9)},
									{"x": x, "y": (height*.9)}];

				leftMeasurement = custLineContainer
				.append("path")
                .attr("d", lineAsIsFunction(measurement1))
                .attr("stroke", "red")
                .attr("stroke-width", 1)
                .attr("fill", "none")
    			.attr('class','left-measurement');

    			custLineContainer
				.append("text")
				.attr("x", function(){return leftMeasurement[0][0].getTotalLength()/2;})
				.attr("y", height*.88)
				.attr('class','curr-label')
				.text(function(){return parseFloat(leftMeasurement[0][0].getTotalLength()/xScaleFactor).toFixed(2);})
				.attr("text-anchor", "middle")
				.attr("alignment-baseline", "after-edge");

    			rightMeasurement = custLineContainer
				.append("path")
                .attr("d", lineAsIsFunction(measurement2))
                .attr("stroke", "red")
                .attr("stroke-width", 1)
                .attr("fill", "none")
    			.attr('class','right-measurement');

    			custLineContainer
				.append("text")
				.attr("x", function(){return leftMeasurement[0][0].getTotalLength()+rightMeasurement[0][0].getTotalLength()/2;})
				.attr("y", height*.88)
				.attr('class','curr-label')
				.text(function(){return parseFloat(rightMeasurement[0][0].getTotalLength()/xScaleFactor).toFixed(2);})
				.attr("text-anchor", "middle")
				.attr("alignment-baseline", "after-edge");
			}			
		}

		function handleClick(){
			var wireCoord = d3.select('circle.circle-vertical-wire');
			var groundCoord = d3.selectAll('circle.circle-vertical-ground');			
			//#canvas > svg > g.g-cont > g > circle.circle-vertical-wire
			console.log("Elevation Coord:", wireCoord.attr('cx')/xScaleFactor, wireCoord.attr('cy')/yScaleFactor);
			console.log("Ground Coord:", groundCoord.attr('cx')/xScaleFactor, groundCoord.attr('cy')/yScaleFactor);
			console.log("Height:", (groundCoord.attr('cy') - wireCoord.attr('cy'))/yScaleFactor);
			console.log('--------------------------------------------------------------------');
			
			var mLine = [{"x": wireCoord.attr('cx'), "y": wireCoord.attr('cy')},
						 {"x": groundCoord.attr('cx'), "y": groundCoord.attr('cy')}];
			
			var textCoord = {"x": wireCoord.attr('cx'),
							 "y": (parseFloat(groundCoord.attr('cy'))+parseFloat(wireCoord.attr('cy')))/2};
			var textVal = parseFloat((groundCoord.attr('cy')-wireCoord.attr('cy'))/yScaleFactor).toFixed(2);
			
			var one = svgAuxillary.append("g")
							.attr('class', crossingType)
							.append("path")
                            .attr("d", lineAsIsFunction(mLine))
                            .attr("stroke", color)
                            .attr("stroke-width", 1)
                            .attr("stroke-dasharray", ("10,3"))
                            .attr("fill", "none")
    						.attr('class', crossingType);

			d3.selectAll("g.aux-line").append("text")
				.attr("x", textCoord.x)
				.attr("y", textCoord.y)
				.attr("text-anchor", "middle")
				.attr("alignment-baseline", "after-edge")
				.text(textVal)
				.attr("font-family", "Arial Black")
		       	.attr("font-size", "1em")
		       	.attr("fill", color)
		        .attr("transform", "rotate(-90 "+textCoord.x+", "+textCoord.y+")");

			color = "blue";
			crossingType = "aux-crossing";
			console.log(mLine);
			console.log(one);
		}
  }

}
	

})(window);
