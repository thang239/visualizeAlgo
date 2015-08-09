window.onload = function() {
	circleChart();
}


var yAxis = 150;
var animation = [];

var NUMBER_CIRCLE = 20;
var MIN_VALUE = 10;
var MAX_VALUE = 40
var dataset;
var SVG_WIDTH = 1500;
var SVG_HEIGHT = 300;
var DURATION = 100;
var PADDING = 2;
var svg;
var timeoutID;
var key = function(d) {
	return d.key;
};


var timeoutGlob = {
	timeouts: [],
	setTimeout: function(func, time) {
		this.timeouts.push(setTimeout(func, time));
	},
	clearTimeout: function() {
		this.timeouts.forEach(function(t) {
			window.clearTimeout(t)
		});
		this.timeouts = [];
	}
}


	function circleChart() {
		var circlePadding = 1;
		var startTime, stopTime, currentTime;
		var element = {};
		// var xScale = d3.scale.ordinal()
		// 	.domain(d3.range(dataset.length))

		//create svg container with width and height
		svg = d3.select('#displaySVG').append('svg')
			.attr('width', SVG_WIDTH)
			.attr('height', SVG_HEIGHT);


		// console.log(element)
		element.circles = svg.selectAll("circle");
		element.texts = svg.selectAll("text");
		d3.select("#generate").on("click", function() {
			timeoutGlob.clearTimeout();
			d3.selectAll("circle").remove();
			d3.selectAll("text").remove();
			dataset = generateDataSet(NUMBER_CIRCLE, MIN_VALUE, MAX_VALUE);
			generateCircles(element, dataset, svg, key)
		})

		d3.select("#update")
			.on("click", function() {
				// console.log(element.circles)
				animation.push({
					type: "swap",
					i: 0,
					j: 4
				})
				steps(element, animation);
			})
		d3.select("#duration")
			.on("input", function() {
				DURATION = (+this.value);
			})

		d3.select("#pauseresume")
			.on("click", function() {
				var self = d3.select(this);
				if (self.text() == "Pause") {
					self.text("Resume")
					d3.selectAll('circle')
						.transition()
						.duration(0);
					d3.selectAll('text')
						.transition().duration(0);

				} else {
					self.text("Pause");
					cotinueTransitions();
				}
			})
		d3.select("#runsort")
			.on("click", function() {
				// console.table(dataset)
				//not actually sort dataset, just get the list of works need to be done
				animation = bubbleSort(dataset, "value") //.reverse();
				animation = insertionSort(dataset, "value") //.reverse();

				// console.table(animation)
				// console.table(dataset)
				steps(animation);
				// swapElement(element, dataset, animation, svg, key, DURATION)
				// setInterval(swapElement(element, dataset, animation, svg, key, DURATION), 2000)
				// console.table(animation)

			})
	};


function generateCircles(element) {
	//create circles elements
	// element.circles = svg.selectAll('circle');
	//create text elements
	// element.texts = svg.selectAll("text");
	//assign attributes for each circle
	var circleAttributes = element.circles.data(dataset, key)
		.enter()
		.append("circle")
		.attr("id", function(d, i) {
			return "circle" + i;
		})
		.attr("cx", function(d, i) {
			return getxAxis(dataset, i) + PADDING * i;
		})
		.attr("cy", function(d) {
			return yAxis;
		})
		.attr("r", function(d) {
			return d.value;
		})
		.style("fill", function(d) {
			return d.color;
		})

	var textLabels = element.texts.data(dataset, key)
		.enter()
		.append("text")
		.text(function(d) {
			return d.value;
		})
		.attr("id", function(d, i) {
			return "circle" + i;
		})
		.attr("text-anchor", "middle")
		.attr("x", function(d, i) {
			return getxAxis(dataset, i) + PADDING * i;
		})
		.attr("y", yAxis)
		.attr("font-family", "sans-serif")
		.attr("font-size", function(d) {
			return d.value + "px"
		})
		.attr("fill", "white");

}

function steps(animation) {
	if (animation.length === 0) return;
	// while (animation.length > 0) {
	var action = animation.shift();
	if (action) {
		dataset.swap(action.i, action.j);
		// console.log(element.circles)
		// element.circles
		svg.selectAll('circle')
			.data(dataset, key)
			.attr("T", 0)
			.transition()
			.duration(DURATION)
			.ease("linear")
			.attr("T", 1)
			.attr("cx", function(d, i) {
				// return d.value * 10;
				return getxAxis(dataset, i) + PADDING * i;
			})
			.attr("cy", function(d) {
				return yAxis;
			});
		// element.texts
		svg.selectAll('text')
			.data(dataset, key)
			.transition()
			.duration(DURATION)
			.text(function(d) {
				return d.value;
			})
			.attr("x", function(d, i) {
				return getxAxis(dataset, i) + PADDING * i;
			})
			.attr("y", yAxis)
			.attr("font-size", function(d) {
				return d.value + "px"
			})

		// swapElement(element, data, animation, svg, key, durationTime);
	}
	// }
	// timeoutID = setTimeout(function() {
	// 	steps(animation)
	// }, DURATION);
	timeoutGlob.setTimeout(function() {
		steps(animation)
	}, DURATION);
	// console.log(timeoutID)

}

function getxAxis(arr, index) {
	var xAxis = 200;
	if (index === 0) return xAxis;
	xAxis += arr[0].value;
	for (var i = 1; i < index; i++) {
		xAxis += arr[i].value * 2;
	}
	xAxis += arr[index].value;
	return xAxis;
}

function generateDataSet(num, min, max) {
	//generate array of integer with leng:num and maxValue:max
	var arr = [];
	for (var i = 0; i < num; i++) {
		arr.push({
			key: i,
			value: Math.floor(Math.random() * (max - min)) + min,
			color: randomColor()
		});
	}
	return arr;
}

function randomColor() {
	return "hsl(" + Math.random() * 360 + ",100%,50%)";
}

function resumed_ease(ease, elapsed_time) {}


function animate() {
	var SVG_WIDTH = 400;
	var SVG_HEIGHT = 400;
	var svg = d3.select('#displaySVG').append('svg')
		.attr('width', SVG_WIDTH)
		.attr('height', SVG_HEIGHT);
}


var sortList = {};

function bubbleSort(arr, prop) {
	var animations = [];
	var brr = _.clone(arr, true);
	var len = brr.length - 1;
	var swapped;

	function swap(i, j) {
		var a = brr[i];
		brr[i] = brr[j];
		brr[j] = a;
	}
	do {
		swapped = false;
		for (i = 0; i < len; i++) {
			if (brr[i][prop] > brr[i + 1][prop]) {
				swap(i, i + 1)
				animations.push({
					type: "swap",
					i: i,
					j: i + 1
				})
				swapped = true;
			}
		}

	} while (swapped == true)
	return animations;
}

function insertionSort(arr, prop) {
	var animations = [];
	var brr = _.clone(arr, true);
	var len = brr.length - 1;

	for (var i = 1; i < len; i++) {
		var k = brr[i][prop];
		for (var j = i - 1; j >= 0 && k < brr[j][prop]; j--) {
			brr[j + 1] = brr[j];
			animations.push({
				type: "swap",
				i: j + 1,
				j: j
			})

		}

		brr[j + 1][prop] = k;
	}
	return animations;
}