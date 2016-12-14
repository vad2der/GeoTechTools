(function () {
"use strict";

angular.module('public')
.controller('SagController', SagController);

//MenuController.$inject = ['menuCategories'];
function SagController() {
  var sagCtrl = this;
  
  //test data --start
  sagCtrl.AEl = 8;
  sagCtrl.AQuatEl = 6.5;
  sagCtrl.Midel = 6;
  sagCtrl.BQuatEl = 6.5;
  sagCtrl.BEl = 8;

  sagCtrl.AGr=2.1;
  sagCtrl.AQuatGr = 2.2;
  sagCtrl.Midgr = 2.1;
  sagCtrl.BQuatGr = 2;
  sagCtrl.BGr = 1.9;

  sagCtrl.sp1 = 2;
  sagCtrl.sp2 = 2;
  sagCtrl.sp3 = 2;
  sagCtrl.sp4 = 2;
  //test data --end

  var height = document.getElementById("canvas").clientHeight;
  var width = document.getElementById("canvas").clientWidth;

  d3.selectAll("svg").remove();
 
  sagCtrl.drawDiagram = function(){
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
                            .attr("fill", "none");
                            //.attr("transform", function (d) {return "translate("+d.x+","+d.y+")"; });

	var groundLineGraph = svgContainer.append("path")
                            .attr("d", lineFunction(groundPoints))
                            .attr("stroke", "green")
                            .attr("stroke-width", 2)
                            .attr("fill", "none");
                            //.attr("transform", function (d) {return "translate("+d.x+","+d.y+")"; });
  }

}
	

})();
