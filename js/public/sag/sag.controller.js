(function () {
"use strict";

angular.module('public')
.controller('SagController', SagController);

SagController.$inject = ['$scope'];
function SagController($scope) {
  var sagCtrl = this;

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
   console.log(width, height);

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
  			.append("g")
    		.attr("transform", "translate("+margin+","+margin+")");


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

	var PoleAGraph = svgAuxillary.append("path")
                            .attr("d", polesFunction(poleA))
                            .attr("stroke", "black")
                            .attr("stroke-width", 5)
                            .attr("fill", "none")                            
    						.attr('class','pole');

	var PoleBGraph = svgAuxillary.append("path")
                            .attr("d", polesFunction(poleB))
                            .attr("stroke", "black")
                            .attr("stroke-width", 5)
                            .attr("fill", "none")
    						.attr('class','pole');
//poles geomentry -ends	
//mid and 1/4 lines -starts
	const AQuat = [{"x": sagCtrl.sp1, "y": sagCtrl.AQuatGr},{"x": sagCtrl.sp1, "y": sagCtrl.AQuatEl}];
	const Mid = [{"x": sagCtrl.sp1+sagCtrl.sp2, "y": sagCtrl.Midgr},{"x": sagCtrl.sp1+sagCtrl.sp2, "y": sagCtrl.Midel}];
	const BQuat = [{"x": sagCtrl.sp1+sagCtrl.sp2+sagCtrl.sp3, "y": sagCtrl.BQuatGr},{"x": sagCtrl.sp1+sagCtrl.sp2+sagCtrl.sp3, "y": sagCtrl.BQuatEl}];
	var innnerLinesFunction = d3.svg.line()
    			.x(d => d.x*xScaleFactor)
    			.y(d => height-2*margin-(d.y-Math.min.apply(null, ground))*yScaleFactor)
    			.interpolate("linear");

	var QuatAGraph = svgAuxillary.append("path")
                            .attr("d", polesFunction(AQuat))
                            .attr("stroke", "black")
                            .attr("stroke-dasharray", ("10,3"))
                            .attr("stroke-width", 1)
                            .attr("fill", "none")
    						.attr('class','inner-aux-line');

	var MidGraph = svgAuxillary.append("path")
                            .attr("d", polesFunction(Mid))
                            .attr("stroke", "black")
                            .attr("stroke-dasharray", ("10,3"))
                            .attr("stroke-width", 1)
                            .attr("fill", "none")
    						.attr('class','inner-aux-line');

	var QuatBGraph = svgAuxillary.append("path")
                            .attr("d", polesFunction(BQuat))
                            .attr("stroke", "black")
                            .attr("stroke-dasharray", ("10,3"))
                            .attr("stroke-width", 1)
                            .attr("fill", "none")
    						.attr('class','inner-aux-line');
// mid and 1/4 lines -ends
  }

}
	

})(window);
