(function () {
"use strict";

angular.module('public')
.controller('SagController', SagController);

SagController.$inject = ['$scope'];
function SagController($scope) {
	var sagCtrl = this;
	let color = "red";
	let crossingType = "dl-crossing";  
	$scope.isDisabledSagElevationForm = undefined;
	$scope.isDisabledSagSpanForm = undefined;
	$scope.isDisabledGrndElevationForm = undefined;
	sagCtrl.stage = 0;

	let coordinates = [0, 0];
	let x, y;
	let custLineContainer;
	let line;
	let textX, textY;
	let measurement1, measurement2, measurementX;
	let leftMeasurement, rightMeasurement, xMeasurement;

	let width = document.getElementById("canvas").clientWidth;
  	let height = width/3;
   	
    let svgRawContainer;
	let svgContainer;
	const margin = 0.005*width;
  	let yScaleFactor;
	let xScaleFactor;
	let polesFunction;
	let lineAsIsFunction;
	let svgAuxillary;
	let lineId = 1;

	var wire;
	var ground;
	let yd;
	sagCtrl.linetypeBool = true;
	sagCtrl.linetypeDisabled = false;
	sagCtrl.linetype = function(){
		if (sagCtrl.linetypeBool == true){
			return "monotone";
		} else {
			return "linear";
		}
		sagCtrl.drawDiagram();
	};

	sagCtrl.deleteEntry = function(entryIndex){
		if(sagCtrl.tableContent[entryIndex].lineId.toString() == "1"){
			color = 'red';
			crossingType = "dl-crossing";
		}
		let l = '#line-id-'+sagCtrl.tableContent[entryIndex].lineId.toString();
		
		d3.selectAll(l).remove();
		sagCtrl.tableContent.splice(entryIndex, 1);
		lineId = sagCtrl.tableContent[entryIndex].lineId.toString() == "1" ? 2: parseInt(sagCtrl.tableContent[entryIndex].lineId);
	}

  	sagCtrl.loadTestData = function(){
		//test data --start
		sagCtrl.AEl = 1042.46;
		sagCtrl.AQuatEl = 1025.96;
		sagCtrl.Midel = 1013.63;
		sagCtrl.BQuatEl = 1005.23;
		sagCtrl.BEl = 1001.31;

		sagCtrl.AGr = 1021.71;
		sagCtrl.AQuatGr = 1008.73;
		sagCtrl.Midgr = 1002.65;
		sagCtrl.BQuatGr = 993.65;
		sagCtrl.BGr = 986.34;

		sagCtrl.sp1 = 64.4;
		sagCtrl.sp2 = 73.6;
		sagCtrl.sp3 = 64.3;
		sagCtrl.sp4 = 64.1;
		//test data --end
		color = "red";

		$scope.sagElevationForm.$setDirty();
		$scope.sagSpanForm.$setDirty();
		$scope.grndElevationForm.$setDirty();
	}

  	sagCtrl.clearData = function(){
		d3.selectAll("svg").remove();
		  
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

		$scope.isDisabledSagElevationForm = false;
		$scope.isDisabledSagSpanForm = false;
		$scope.isDisabledGrndElevationForm = false;

		$scope.sagElevationForm.$setUntouched();
		$scope.sagSpanForm.$setUntouched();
		$scope.grndElevationForm.$setUntouched();

		sagCtrl.tableContent = undefined;
		crossingType = "dl-crossing";
		color = "red";
		sagCtrl.stage = 0;
		lineId = 1;
		sagCtrl.linetypeDisabled = false;
	}

	sagCtrl.clearCrossings = function(){
		$scope.isDisabledSagElevationForm = false;
		$scope.isDisabledSagSpanForm = false;
		$scope.isDisabledGrndElevationForm = false;

		$scope.sagElevationForm.$setUntouched();
		$scope.sagSpanForm.$setUntouched();
		$scope.grndElevationForm.$setUntouched();

		sagCtrl.tableContent = undefined;
		crossingType = "dl-crossing";
		color = "red";
		sagCtrl.stage = 2;
		lineId = 1;
		sagCtrl.linetypeDisabled = false;
		sagCtrl.drawDiagram();		
	}


  	sagCtrl.drawDiagram = function(){  		

	  	if (!$scope.sagElevationForm.$valid || !$scope.sagSpanForm.$valid || !$scope.grndElevationForm.$valid){return};
	  	sagCtrl.stage = 2;
	  	//sagCtrl.linetypeDisabled = true;
	  	wire = [parseFloat(sagCtrl.AEl), parseFloat(sagCtrl.AQuatEl), parseFloat(sagCtrl.Midel), parseFloat(sagCtrl.BQuatEl), parseFloat(sagCtrl.BEl)];
	  	ground = [parseFloat(sagCtrl.AGr), parseFloat(sagCtrl.AQuatGr), parseFloat(sagCtrl.Midgr), parseFloat(sagCtrl.BQuatGr), parseFloat(sagCtrl.BGr)];
	  	yd = (Math.max.apply(null, wire) - Math.min.apply(null, ground));
	  	yScaleFactor = getYScale();
	  	xScaleFactor =  getXScale();
	  	// console.log(width, height);
	  	// console.log(xScaleFactor, yScaleFactor);

	  	sagCtrl.tableContent = [{"chain": 0, "groundElevation": parseFloat(sagCtrl.AGr) , "wireElevation": parseFloat(sagCtrl.AEl), "name": "POLE A"},
						{"chain": parseFloat(sagCtrl.sp1), "groundElevation": parseFloat(sagCtrl.AQuatGr) , "wireElevation": parseFloat(sagCtrl.AQuatEl), "name": "1/4 SPAN"},
						{"chain": parseFloat(sagCtrl.sp1)+parseFloat(sagCtrl.sp2), "groundElevation": parseFloat(sagCtrl.Midgr) , "wireElevation": parseFloat(sagCtrl.Midel), "name": "MID SPAN"},
						{"chain": parseFloat(sagCtrl.sp1)+parseFloat(sagCtrl.sp2)+parseFloat(sagCtrl.sp3), "groundElevation": parseFloat(sagCtrl.BQuatGr) , "wireElevation": parseFloat(sagCtrl.BQuatEl), "name": "1/4 SPAN"},
						{"chain": parseFloat(sagCtrl.sp1)+parseFloat(sagCtrl.sp2)+parseFloat(sagCtrl.sp3)+parseFloat(sagCtrl.sp4), "groundElevation": parseFloat(sagCtrl.BGr) , "wireElevation": parseFloat(sagCtrl.BEl), "name": "POLE B"}];

	  	d3.selectAll("svg").remove();
	  	  	
	  	let wirePoints = [{"x": 0.00, "y": parseFloat(sagCtrl.AEl)},
	  					  {"x": parseFloat(sagCtrl.sp1), "y": parseFloat(sagCtrl.AQuatEl)},
	  					  {"x": parseFloat(sagCtrl.sp1)+parseFloat(sagCtrl.sp2), "y": parseFloat(sagCtrl.Midel)},
	  					  {"x": parseFloat(sagCtrl.sp1)+parseFloat(sagCtrl.sp2)+parseFloat(sagCtrl.sp3), "y": parseFloat(sagCtrl.BQuatEl)},
	  					  {"x": parseFloat(sagCtrl.sp1)+parseFloat(sagCtrl.sp2)+parseFloat(sagCtrl.sp3)+parseFloat(sagCtrl.sp4), "y": parseFloat(sagCtrl.BEl)}];

		let groundPoints = [{"x": 0.00, "y": parseFloat(sagCtrl.AGr)},
	  					 	{"x": parseFloat(sagCtrl.sp1), "y": parseFloat(sagCtrl.AQuatGr)},
	  					    {"x": parseFloat(sagCtrl.sp1)+parseFloat(sagCtrl.sp2), "y": parseFloat(sagCtrl.Midgr)},
	  					    {"x": parseFloat(sagCtrl.sp1)+parseFloat(sagCtrl.sp2)+parseFloat(sagCtrl.sp3), "y": sagCtrl.BQuatGr},
	  					    {"x": parseFloat(sagCtrl.sp1)+parseFloat(sagCtrl.sp2)+parseFloat(sagCtrl.sp3)+parseFloat(sagCtrl.sp4), "y": sagCtrl.BGr}];

	 	let lineFunction = d3.svg.line()
	    					.x(d => d.x*xScaleFactor)
	    					.y(d => height - 2*margin - (d.y - Math.min.apply(null, ground))*yScaleFactor)
	    					.interpolate(sagCtrl.linetype());

	    let lineFunctionLinear = d3.svg.line()
	    					.x(d => d.x*xScaleFactor)
	    					.y(d => height - 2*margin - (d.y - Math.min.apply(null, ground))*yScaleFactor)
	    					.interpolate("linear");

		svgRawContainer = d3.select("#canvas").append("svg")
	    	.attr("width", width)
	    	.attr("height", height)
	    	.attr('class','svg-cont');
	    	
		svgContainer = svgRawContainer
	  			.append("g")
	    		.attr("transform", "translate("+margin+","+margin+")")
	    		.attr('class','g-cont');
	    
	    let wireLineGraph = svgContainer.append("path")
	                            .attr("d", lineFunction(wirePoints))
	                            .attr("stroke", "blue")
	                            .attr("stroke-width", 2)
	                            .attr("fill", "none")
	    						.attr('class','wire');

		let groundLineGraph = svgContainer.append("path")
	                            .attr("d", lineFunctionLinear(groundPoints))
	                            .attr("stroke", "green")
	                            .attr("stroke-width", 2)
	                            .attr("fill", "none")
	    						.attr('class','ground');

	// additional geometry --starts	
		svgAuxillary = d3.selectAll("svg")
	    	.attr("width", width)
	    	.attr("height", height)
	  			.append("g")
	    		.attr("transform", "translate("+margin+","+margin+")");

	// poles geomentry -starts
		polesFunction = d3.svg.line()
	    			.x(d => d.x*xScaleFactor)
	    			.y(d => height-2*margin-(d.y-Math.min.apply(null, ground))*yScaleFactor)
	    			.interpolate("linear");

	    const poleA = [{"x": 0.0, "y": parseFloat(sagCtrl.AGr)},
	    			   {"x": 0.0, "y": parseFloat(sagCtrl.AEl)}];
	    const poleB = [{"x": parseFloat(sagCtrl.sp1)+parseFloat(sagCtrl.sp2)+parseFloat(sagCtrl.sp3)+parseFloat(sagCtrl.sp4), "y": parseFloat(sagCtrl.BGr)},
	    			   {"x": parseFloat(sagCtrl.sp1)+parseFloat(sagCtrl.sp2)+parseFloat(sagCtrl.sp3)+parseFloat(sagCtrl.sp4), "y": parseFloat(sagCtrl.BEl)}];

		let PoleAGraph = svgAuxillary.append("g")
								.attr('class', 'poleA')
	               				.append('path')
	                            .attr("d", polesFunction(poleA))
	                            .attr("stroke", "black")
	                            .attr("stroke-width", 5)
	                            .attr("fill", "none")                            
	    						.attr('class','pole');

		let PoleBGraph = svgAuxillary.append("g")
								.attr('class', 'poleB')
								.append("path")
	                            .attr("d", polesFunction(poleB))
	                            .attr("stroke", "black")
	                            .attr("stroke-width", 5)
	                            .attr("fill", "none")
	    						.attr('class','pole');

		let poleAcx = 0;
		//console.log(d3.select('g.poleA').select('path.pole'));
	    let poleAcy = height/2 ;//height-2*margin-((poleA[1].y-poleA[0].y)/2)*yScaleFactor;
	    let poleAdy = parseFloat(poleA[1].y-poleA[0].y).toFixed(2);

		d3.selectAll("g.poleA").append("text")
			.attr("x", poleAcx)
			.attr("y", poleAcy)
			.attr("text-anchor", "middle")
			.attr("alignment-baseline", "before-edge")
			.text(poleAdy+ " (pole A)")
			.attr("font-family", "Arial Black")
	       	.attr("font-size", "1em")
	       	.attr("fill", "grey")
	        .attr("transform", "rotate(-90 "+poleAcx+", "+poleAcy+")");

	    let poleBcx = (parseFloat(sagCtrl.sp1)+parseFloat(sagCtrl.sp2)+parseFloat(sagCtrl.sp3)+parseFloat(sagCtrl.sp4))*xScaleFactor;
	    let poleBcy = height/2;//height-2*margin-((poleB[1].y-poleB[0].y)/2)*yScaleFactor;
	    let poleBdy = parseFloat(poleB[1].y-poleB[0].y).toFixed(2);

		d3.selectAll("g.poleB").append("text")
			.attr("x", poleBcx)
			.attr("y", poleBcy)
			.attr("text-anchor", "middle")
			.attr("alignment-baseline", "after-edge")
			.text(poleBdy+" (pole B)")
			.attr("font-family", "Arial Black")
	       	.attr("font-size", "1em")
	       	.attr("fill", "grey")
	        .attr("transform", "rotate(-90 "+poleBcx+", "+poleBcy+")");

	//poles geomentry -ends	
	//mid and 1/4 lines -starts
		const inner = [[{"x": parseFloat(sagCtrl.sp1), "y": parseFloat(sagCtrl.AQuatGr)},
						{"x": parseFloat(sagCtrl.sp1), "y": parseFloat(sagCtrl.AQuatEl)}],
					   [{"x": parseFloat(sagCtrl.sp1)+parseFloat(sagCtrl.sp2), "y": parseFloat(sagCtrl.Midgr)},
					    {"x": parseFloat(sagCtrl.sp1)+parseFloat(sagCtrl.sp2), "y": parseFloat(sagCtrl.Midel)}],
					   [{"x": parseFloat(sagCtrl.sp1)+parseFloat(sagCtrl.sp2)+parseFloat(sagCtrl.sp3), "y": parseFloat(sagCtrl.BQuatGr)},
					    {"x": parseFloat(sagCtrl.sp1)+parseFloat(sagCtrl.sp2)+parseFloat(sagCtrl.sp3), "y": parseFloat(sagCtrl.BQuatEl)}]];
		
		let innnerLinesFunction = d3.svg.line()
	    			.x(d => d.x*xScaleFactor)
	    			.y(d => height-2*margin-(d.y-Math.min.apply(null, ground))*yScaleFactor)
	    			.interpolate("linear");

		lineAsIsFunction = d3.svg.line()
	    			.x(d => d.x)
	    			.y(d => d.y)
	    			.interpolate("linear");
		
		let auxLines = svgAuxillary.selectAll("g.aux-line")
					.data(inner).enter()
					.append("g")

		auxLines.attr('class', 'aux-line')
	               	.append('path')
	                .attr("d", d => polesFunction(d))
	                .attr("stroke", "black")
	                .attr("stroke-dasharray", ("10,3"))
	                .attr("stroke-width", 1)
	                .attr("fill", "none")
	    			.attr('class','inner-aux-line');
	    	
	    	// var cx = unit[0].x*xScaleFactor;
	    	// var cy = height-2*margin-((unit[0].y+unit[1].y)/2-Math.min.apply(null, ground))*yScaleFactor
	    	// var dy = parseFloat(unit[1].y-unit[0].y).toFixed(2);

		auxLines.append("text")
			.attr("x", d => d[0].x*xScaleFactor)
			.attr("y", d => height-2*margin-((d[0].y+d[1].y)/2-Math.min.apply(null, ground))*yScaleFactor)
			.attr("text-anchor", "middle")
			.attr("alignment-baseline", "after-edge")
			.text(function(d,i){ if (i == 1){return parseFloat(d[1].y-d[0].y).toFixed(2) + " (MID)"} else {return parseFloat(d[1].y-d[0].y).toFixed(2) + " (1/4)"}})
			.attr("font-family", "Arial Black")
	       	.attr("font-size", "1em")
	       	.attr("fill", "grey")
	        .attr("transform", rotateThis);
				
		function rotateThis(d,i){return "rotate(-90 "+$(this).attr('x')+", "+$(this).attr('y')+")";}
	// mid and 1/4 lines -ends
  	}

  	$scope.$watch('sagElevationForm.$dirty', setStageTo1);
  	$scope.$watch('sagSpanForm.$dirty', setStageTo1);
  	$scope.$watch('grndElevationForm.$dirty', setStageTo1);

  	function setStageTo1(n){
  		if(n && sagCtrl.stage == 0){sagCtrl.stage = 1;}
  	}

    sagCtrl.secureInput = function(){
    	sagCtrl.stage = 3;
    	sagCtrl.linetypeDisabled = true;
		$scope.isDisabledSagElevationForm = true;
	  	$scope.isDisabledSagSpanForm = true;
	  	$scope.isDisabledGrndElevationForm = true;

		$scope.sagElevationForm.$setDirty();
		$scope.sagSpanForm.$setDirty();
	  	$scope.grndElevationForm.$setDirty();

   		svgRawContainer
    	.on("mousemove", handleMouseMove)    	
    	.on("click", handleClick);
   	}

	function getXScale(){		
		return (width - 2*margin)/(parseFloat(sagCtrl.sp1)+parseFloat(sagCtrl.sp2)+parseFloat(sagCtrl.sp3)+parseFloat(sagCtrl.sp4));
	}

	function getYScale(){
		return (height - 2*margin)/yd; //units in height pixels  	
	}

	function handleMouseMove(d, i){     	
        coordinates = d3.mouse(this);
		x = coordinates[0];
		y = coordinates[1];

		d3.selectAll('text.curr-label').remove();
		d3.selectAll('g.custom-verticals').remove();
		d3.selectAll('circle.circle-vertical-ground').remove();
		d3.selectAll('circle.circle-vertical-wire').remove();

		line = [{"x": x/xScaleFactor,
				 "y": Math.max.apply(null, wire)},
				{"x": x/xScaleFactor,
				 "y": Math.min.apply(null, ground)}];

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
			let pathEl = d3.select('path.wire').node();
			let intersectionEl;
			let pathGr = d3.select('path.ground').node();
			let intersectionGr;
			let custLine = d3.select('path.custom-vertical').node();

			let shape1 = new Path(pathEl);
			let linePath = new Path(custLine);
			var overlays1 = Intersection.intersectPathShape(shape1, linePath);

			let shape2 = new Path(pathGr);
			var overlays2 = Intersection.intersectPathShape(shape2, linePath);			

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

			
			if (overlays1.status == "No Intersection" || overlays2.status == "No Intersection"){
				console.log(overlays2);
				console.log(overlays1);
				return;
			}
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
			if (color == "red"){

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

			} else if (color == "blue"){
				measurementX = [{"x": sagCtrl.zero*xScaleFactor, "y": (height*.9)},
								{"x": x, "y": (height*.9)}];

				xMeasurement = custLineContainer
					.append("path")
	                .attr("d", lineAsIsFunction(measurementX))
	                .attr("stroke", "red")
	                .attr("stroke-width", 1)
	                .attr("fill", "none")
	    			.attr('class','left-measurement');

	    		custLineContainer
					.append("text")
					.attr("x", function(){if (x < sagCtrl.zero*xScaleFactor){return sagCtrl.zero*xScaleFactor - xMeasurement[0][0].getTotalLength()/2;}else if(x > sagCtrl.zero*xScaleFactor){return sagCtrl.zero*xScaleFactor + xMeasurement[0][0].getTotalLength()/2;}})
					.attr("y", height*.88)
					.attr('class','curr-label')
					.text(function(){if (x < sagCtrl.zero*xScaleFactor){return -parseFloat(xMeasurement[0][0].getTotalLength()/xScaleFactor).toFixed(2);}else if(x > sagCtrl.zero*xScaleFactor){return parseFloat(xMeasurement[0][0].getTotalLength()/xScaleFactor).toFixed(2);}})
					.attr("text-anchor", "middle")
					.attr("alignment-baseline", "after-edge")
			}
		}			
	}

	function handleClick(){
		let wireCoord = d3.select('circle.circle-vertical-wire');
		let groundCoord = d3.selectAll('circle.circle-vertical-ground');
		
		let mLine = [{"x": wireCoord.attr('cx'), "y": wireCoord.attr('cy')},
					 {"x": groundCoord.attr('cx'), "y": groundCoord.attr('cy')}];
		let textCoord = {"x": wireCoord.attr('cx'),
						 "y": (parseFloat(groundCoord.attr('cy'))+parseFloat(wireCoord.attr('cy')))/2};
		let textVal = parseFloat((groundCoord.attr('cy') - wireCoord.attr('cy'))/yScaleFactor).toFixed(2);
		
		svgAuxillary.append("g")
					.attr('class', crossingType)
					.append("path")
                    .attr("d", lineAsIsFunction(mLine))
                    .attr("stroke", color)
                    .attr("stroke-width", 1)
                    .attr("stroke-dasharray", ("10,3"))
                    .attr("fill", "none")
    				.attr('class', crossingType)
    				.attr('id', function(){return "line-id-" + lineId.toString();});

		d3.selectAll("g.aux-line").append("text")
			.attr("x", textCoord.x)
			.attr("y", textCoord.y)
			.attr('class', crossingType)
			.attr("text-anchor", "middle")
			.attr("alignment-baseline", "after-edge")
			.text(textVal)
			.attr("font-family", "Arial Black")
		    .attr("font-size", "1em")
		    .attr("fill", color)
		    .attr("transform", "rotate(-90 "+textCoord.x+", "+textCoord.y+")")
		    .attr('id', function(){return "line-id-" + lineId.toString();});
		
		let name;
		if(crossingType == "dl-crossing"){
			name = "CROSSING";
			sagCtrl.zero = parseFloat(groundCoord.attr('cx')/xScaleFactor).toFixed(2);
			sagCtrl.tableContent.forEach(function(entry){
				entry.chain = (parseFloat(entry.chain).toFixed(2) - parseFloat(sagCtrl.zero).toFixed(2)).toFixed(2);
			})
		}else{name = "";}

		updateTable({"chain": (parseFloat(groundCoord.attr('cx')/xScaleFactor).toFixed(2) - sagCtrl.zero).toFixed(2),
					 "groundElevation": parseFloat((height - 2*margin - groundCoord.attr('cy'))/yScaleFactor + Math.min.apply(null, ground)).toFixed(2),
					 "wireElevation": parseFloat((height - 2*margin - wireCoord.attr('cy'))/yScaleFactor + Math.min.apply(null, ground)).toFixed(2),
					 "name": name, "lineId": lineId});

		lineId += 1;
		color = "blue";
		crossingType = "aux-crossing";
		$scope.$digest();			
	}

	function updateTable(newCrossing){
		sagCtrl.tableContent.push(newCrossing);
		
		sagCtrl.tableContent.sort(function (a, b) {
	  		return parseFloat(a.chain).toFixed(2) - parseFloat(b.chain).toFixed(2);
		});
		
	}
}
})(window);
