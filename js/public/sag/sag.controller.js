(function () {
"use strict";

angular.module('public')
.controller('SagController', SagController);

//MenuController.$inject = ['menuCategories'];
function SagController() {
  var sagCtrl = this;
  

  $("canvas").width($(document).width()*0.8);
  $("canvas").height($(document).height()*0.8);
  console.log($(document).height());
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
