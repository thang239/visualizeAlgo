window.onload = function() {
	circleChart();
	// play()
}


var yAxis = 150;
var animation = [];

var NUMBER_CIRCLE = 50;
var MIN_VALUE = 1;
var MAX_VALUE = 17;
var dataset;
var SVG_WIDTH = 1500;
var SVG_HEIGHT = 300;
var DURATION = 100;
var PADDING = 2;
var svg, svg2;
var timeoutID;
// var tones = play();

var sortType = "bubbleSort";
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


		// svg2 = d3.select('#displaySVG2').append('svg')
		// 	.attr('width', SVG_WIDTH)
		// 	.attr('height', SVG_HEIGHT);
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
				switch (sortType) {
					case "bubbleSort":
						animation = bubbleSort(dataset, "value");
						break;
					case "insertionSort":
						animation = insertionSort(dataset, "value");
						break;
					case "selectionSort":
						animation = selectionSort(dataset, "value");
						break;
					case "mergeSort":
						animation = mergeSort(dataset, "value");
						break;
				}
				// tones.play(233, 4);
				// dataset.forEach(function(d) {
				// tones.play(getNote(d.value), 4);
				// });
				// tones.play(getNote(17), 6);

				// console.table(dataset)
				//not actually sort dataset, just get the list of works need to be done

				// console.table(animation)
				// console.table(dataset)
				steps(animation);
				// swapElement(element, dataset, animation, svg, key, DURATION)
				// setInterval(swapElement(element, dataset, animation, svg, key, DURATION), 2000)
				// console.table(animation)

			})

		d3.select("#selectSorting").on("change", function() {
			// console.log(this.options[this.selectedIndex].value)
			sortType = this.options[this.selectedIndex].value;
			// console.log(sortType);
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
	if (animation.length === 0) {
		// var data = dataset.map(function(d) {
		// 	return d.value
		// })


		// console.log(data);
		// data.forEach(function(d) {
		// 	tones.play(getNote(d), 5);
		// })
		return;

	}
	// while (animation.length > 0) {
	var action = animation.shift();
	if (action && (action.type === "swap")) {
		dataset.swap(action.i, action.j);
		// tones.play(getNote(action.i), 5);
		tones.play(getNote(action.j), 5);
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
	} else if (action.type === "create") {
		if (!svg2) {
			svg2 = d3.select('#displaySVG2').append('svg')
				.attr('width', SVG_WIDTH)
				.attr('height', SVG_HEIGHT);
		};


	}
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
	//clone array to avoid arr changing
	var brr = _.clone(arr, true);
	var len = brr.length - 1;
	var swapped;

	do {
		swapped = false;
		for (i = 0; i < len; i++) {
			if (brr[i][prop] > brr[i + 1][prop]) {
				swap(brr, i, i + 1)
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
	var len = brr.length;

	for (var i = 0; i < len; i++) {
		j = i;
		while (j > 0 && brr[j][prop] < brr[j - 1][prop]) {
			swap(brr, j, j - 1);
			animations.push({
				type: "swap",
				i: j,
				j: j - 1
			})
			j--;
		}
	}

	return animations;
}

function selectionSort(arr, prop) {

	var animations = [];
	var brr = _.clone(arr, true);
	var len = brr.length;
	var i, j, iMin;
	// refer to https://en.wikipedia.org/wiki/Selection_sort
	for (j = 0; j < len - 1; j++) {
		iMin = j;
		for (var i = j + 1; i < len; i++) {
			if (brr[i][prop] < brr[iMin][prop]) {
				iMin = i;
			}
		}
		if (iMin != j) {
			swap(brr, j, iMin);
			animations.push({
				type: "swap",
				i: j,
				j: iMin
			})
		}
	}

	return animations;
}

function getNote(num) {
	var map = {
		// octave 4
		"c": 261.626,
		"c#": 277.183,
		"db": 277.183,
		"d": 293.665,
		"d#": 311.127,
		"eb": 311.127,
		"e": 329.628,
		"f": 349.228,
		"f#": 369.994,
		"gb": 369.994,
		"g": 391.995,
		"g#": 415.305,
		"ab": 415.305,
		"a": 440,
		"a#": 466.164,
		"bb": 466.164,
		"b": 493.883
	};
	var tone = Object.keys(map);
	return tone[num % tone.length];
}

//credit :http://www.nczonline.net/blog/2009/01/27/speed-up-your-javascript-part-3/
function mergeSort(arr, prop) {
	var animations = [];
	var brr = _.clone(arr, true);
	var len = brr.length;

	function merge(left, right) {
		var result = [];

		while (left.length && right.length) {
			if (left[0] <= right[0]) {
				result.push(left.shift());
			} else {
				result.push(right.shift());
			}
		}

		while (left.length)
			result.push(left.shift());

		while (right.length)
			result.push(right.shift());

		return result;
	}
	if (arr.length < 2)
		return arr;

	var middle = parseInt(arr.length / 2);
	var left = arr.slice(0, middle);
	var right = arr.slice(middle, arr.length);

	return merge(mergeSort(left), mergeSort(right));

}

function swap(brr, i, j) {
	var a = brr[i];
	brr[i] = brr[j];
	brr[j] = a;
}