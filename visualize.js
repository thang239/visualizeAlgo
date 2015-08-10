var yAxis = 150;
var animation = [];

var NUMBER_SHAPES = 30;
var MIN_VALUE = 1;
var MAX_VALUE = 34;
var dataset;
var dataset_sorted;
var SVG_WIDTH = 1200;
var SVG_HEIGHT = 400;
var DURATION = 100;
var PADDING = 2;
var MIN_FONT_SIZE = 10;
var svg, svg2;
var timeoutID;
var generate, update;
// var tones = play();

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
};

var sortType = "bubbleSort";
var shapeType = "circles";
var key = function(d) {
	return d.key;
};
window.onload = function() {
	circleShape();
	// play()
}



function circleShape() {
	var circlePadding = 1;
	var startTime, stopTime, currentTime;
	var xScale, yScale;
	var element = {};

	//create svg container with width and height
	svg = d3.select('#displaySVG').append('svg')
		.attr('width', SVG_WIDTH)
		.attr('height', SVG_HEIGHT);

	element.circles = svg.selectAll("circle");
	element.bars = svg.selectAll("rect");
	element.texts = svg.selectAll("text");



	//generate dataset
	d3.select("#generate").on("click", function() {
		clearView();
		dataset = generateRandomDataset(NUMBER_SHAPES, MIN_VALUE, MAX_VALUE);
		getNewSvgWidth();
		xScale = d3.scale.ordinal()
			.domain(d3.range(dataset.length))
			.rangeRoundBands([0, SVG_WIDTH], 0.2);
		yScale = d3.scale.linear()
			.domain([0, d3.max(dataset, function(d) {
				return d.value;
			})])
			.range([0, SVG_HEIGHT]);
		generate[shapeType](element, xScale, yScale);
	})
	d3.select("#duration")
		.on("input", function() {
			DURATION = (+this.value);
		})

	d3.select("#shape")
		.on("input", function() {
			NUMBER_SHAPES = (+this.value);
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
				case "heapSort":
					animation = heapSort(dataset, "value");
					break;
				default:
					console.log('no sort');
			}
			steps(animation, xScale, yScale);
		})

	d3.select("#selectSorting").on("change", function() {
		sortType = this.options[this.selectedIndex].value;
	})

	d3.select("#selectShape").on("change", function() {
		shapeType = this.options[this.selectedIndex].value;
	})

	d3.select("#shuffle").on("click", function() {
		dataset = generateFixedDataset();
		getNewSvgWidth();
		xScale = d3.scale.ordinal()
			.domain(d3.range(dataset.length))
			.rangeRoundBands([0, SVG_WIDTH], 0.2);
		yScale = d3.scale.linear()
			.domain([0, d3.max(dataset, function(d) {
				return d.value;
			})])
			.range([0, SVG_HEIGHT]);
		clearView();
		generate[shapeType](element, xScale, yScale);
	})
};
generate = {
	circles: function generateCircles(element) {
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
				return (d.value < MIN_FONT_SIZE) ? (MIN_FONT_SIZE + "px") : (d.value + "px");
			})
			.attr("fill", "white");

	},
	bars: function generateBars(element, xScale, yScale) {
		var barAttributes = element.bars.data(dataset, key)
			.enter()
			.append("rect")
			.attr("id", function(d, i) {
				return "rect" + i;
			})
			.attr("x", function(d, i) {
				return xScale(i);
			})
			.attr("y", function(d) {
				return SVG_HEIGHT - yScale(d.value) - 10;
			})
			.attr("width", xScale.rangeBand())
			.attr("height", function(d) {
				return yScale(d.value)
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
				return xScale(i) + xScale.rangeBand() / 2;
			})
			.attr("y", function(d) {
				return SVG_HEIGHT - yScale(d.value) + d.value * 2;
			})
			.attr("font-family", "sans-serif")
			.attr("font-size", function(d) {
				return (d.value < MIN_FONT_SIZE) ? (MIN_FONT_SIZE + "px") : (d.value + "px");
			})
			.attr("fill", "white");

	}

};



function play() {
	if (dataset_sorted.length === 0) return;
	var note = dataset_sorted.pop();
	tones.play(getNote(note.value), 5);
	setTimeout(function() {
		play();
	}, DURATION);
}

function steps(animation, xScale, yScale) {
	if (animation.length === 0) {
		dataset_sorted = _.clone(dataset, true);
		play();
		return;
	}
	// while (animation.length > 0) {
	var action = animation.shift();
	if (action && (action.type === "swap")) {
		dataset.swap(action.i, action.j);
		tones.play(getNote(action.i), 5);
		tones.play(getNote(action.j), 5);
		//update shapes and texts
		update[shapeType](xScale, yScale);
		update.texts(xScale, yScale);
		// element.texts
	} else if (action.type === "create") {
		if (!svg2) {
			svg2 = d3.select('#displaySVG2').append('svg')
				.attr('width', SVG_WIDTH)
				.attr('height', SVG_HEIGHT);
		};


	}
	timeoutGlob.setTimeout(function() {
		steps(animation, xScale, yScale)
	}, DURATION);
}

update = {
	circles: function updateCircles() {
		svg.selectAll('circle')
			.data(dataset, key)
			.attr("T", 0)
			.transition()
			.duration(DURATION)
			.ease("linear")
			.attr("T", 1)
			.attr("cx", function(d, i) {
				return getxAxis(dataset, i) + PADDING * i;
			})
			.attr("cy", function(d) {
				return yAxis;
			});
	},
	bars: function updateBars(xScale, yScale) {
		svg.selectAll('rect')
			.data(dataset, key)
			.transition()
			.duration(DURATION)
			.attr("x", function(d, i) {
				return xScale(i);
			})
			.attr("y", function(d) {
				return SVG_HEIGHT - yScale(d.value);
			})
			.attr("width", xScale.rangeBand())
			.attr("height", function(d) {
				return yScale(d.value)
			})
	},
	texts: function updateText(xScale, yScale) {
		if (shapeType === "circles") {
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
					return (d.value < MIN_FONT_SIZE) ? (MIN_FONT_SIZE + "px") : (d.value + "px");
				})
		} else {
			svg.selectAll('text').data(dataset, key)
				.transition()
				.duration(DURATION)
				.text(function(d) {
					return d.value;
				})
				.attr("id", function(d, i) {
					return "circle" + i;
				})
				.attr("x", function(d, i) {
					return xScale(i) + xScale.rangeBand() / 2;
				})
				.attr("y", function(d) {
					return SVG_HEIGHT - yScale(d.value) + d.value * 2;
				})
				.attr("font-size", function(d) {
					return (d.value < MIN_FONT_SIZE) ? (MIN_FONT_SIZE + "px") : (d.value + "px");
				})
		}

	}

}

function getNewSvgWidth() {
	if (shapeType === "circles") {
		var newWidth = dataset.reduce(function(sum, d) {
			sum += d.value * 2;
			return sum;
		}, 0) + 200 + PADDING * dataset.length;
		SVG_WIDTH = SVG_WIDTH < newWidth ? newWidth : SVG_WIDTH;
		svg.attr('width', SVG_WIDTH);
	} else {
		SVG_WIDTH = 1200;
	}
}

function getxAxis(arr, index) {
	var xAxis = 100;
	if (index === 0) return xAxis;
	xAxis += arr[0].value;
	for (var i = 1; i < index; i++) {
		xAxis += arr[i].value * 2;
	}
	xAxis += arr[index].value;
	return xAxis;
}

function generateRandomDataset(num, min, max) {
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

function generateFixedDataset() {
	var arr = d3.range(1, 35);
	shuffle(arr);
	console.log(arr);
	return arr.map(function(d, i) {
		return {
			key: i,
			value: d,
			color: getBlueColor(d)
		};
	});
}

function randomColor() {
	return "hsl(" + Math.random() * 360 + ",100%,50%)";
}

function getBlueColor(value) {
	return "rgb(0, 0, " + (value * 10) + ")";
}

function shuffle(array) {
	var j;
	for (var i = array.length - 1; i > 0; i--) {
		j = ~~ (Math.random() * (i + 1));
		array.swap(j, i)
	}
}

// function resumed_ease(ease, elapsed_time) {}

// function animate() {
// 	var SVG_WIDTH = 400;
// 	var SVG_HEIGHT = 400;
// 	var svg = d3.select('#displaySVG').append('svg')
// 		.attr('width', SVG_WIDTH)
// 		.attr('height', SVG_HEIGHT);
// }


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
// function mergeSort(arr, prop) {
// 	var animations = [];
// 	var brr = _.clone(arr, true);
// 	var len = brr.length;

// 	function merge(left, right) {
// 		var result = [];

// 		while (left.length && right.length) {
// 			if (left[0] <= right[0]) {
// 				result.push(left.shift());
// 			} else {
// 				result.push(right.shift());
// 			}
// 		}

// 		while (left.length)
// 			result.push(left.shift());

// 		while (right.length)
// 			result.push(right.shift());

// 		return result;
// 	}
// 	if (arr.length < 2)
// 		return arr;

// 	var middle = parseInt(arr.length / 2);
// 	var left = arr.slice(0, middle);
// 	var right = arr.slice(middle, arr.length);

// 	return merge(mergeSort(left), mergeSort(right));

// }

function heapSort(arr, prop) {

	var animations = [];
	var brr = _.clone(arr, true);
	// var len = brr.length;
	console.log(brr.map(function(d) {
		return d.value;
	}));
	put_array_in_heap_order(brr, prop);
	end = brr.length - 1;
	while (end > 0) {
		swap(brr, 0, end);
		animations.push({
			type: "swap",
			i: 0,
			j: end
		})
		sift_element_down_heap(brr, 0, end, prop);
		end -= 1;
	}

	function put_array_in_heap_order(arrT, prop) {
		var i;
		i = arrT.length / 2 - 1;
		i = Math.floor(i);
		while (i >= 0) {
			sift_element_down_heap(arrT, i, arrT.length, prop);
			i -= 1;
		}
	}

	function sift_element_down_heap(heap, i, max, prop) {
		var i_big, c1, c2;
		while (i < max) {
			i_big = i;
			c1 = 2 * i + 1;
			c2 = c1 + 1;
			if (c1 < max && heap[c1][prop] > heap[i_big][prop])
				i_big = c1;
			if (c2 < max && heap[c2][prop] > heap[i_big][prop])
				i_big = c2;
			if (i_big == i) return;
			swap(heap, i, i_big);
			animations.push({
				type: "swap",
				i: i,
				j: i_big
			})
			i = i_big;
		}
	}

	console.log(brr.map(function(d) {
		return d.value;
	}));
	return animations;
}

function clearView() {
	timeoutGlob.clearTimeout();
	d3.selectAll("circle").remove();
	d3.selectAll("rect").remove();
	d3.selectAll("text").remove();
}

function swap(arr, i, j) {
	var temp = arr[i];
	arr[i] = arr[j];
	arr[j] = temp;
}