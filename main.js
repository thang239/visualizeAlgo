window.onload = function() {
	// circles();
	// lineGraph();
	// circleGroup();
	// circleTextBinding();
	barchart();
	// circleChart();
}



function circles() {
	// var theData = [1, 2, 3];
	// var p = d3.select("body").selectAll("p")
	// 	.data(theData)
	// 	.enter()
	// 	.append("p")
	// 	.text(function(d, i) {
	// 		return "i = " + i + " d = " + d;
	// 	});

	var jsonCircles = [{
		"x_axis": 30,
		"y_axis": 30,
		"radius": 20,
		"color": "green"
	}, {
		"x_axis": 70,
		"y_axis": 70,
		"radius": 20,
		"color": "purple"
	}, {
		"x_axis": 110,
		"y_axis": 100,
		"radius": 20,
		"color": "red"
	}];

	var circleRadii = [40, 20, 10];
	var svgContainer = d3.select("body").append("svg").attr("width", 600).attr("height", 100);
	var circles = svgContainer.selectAll("circle").data(circleRadii).enter().append("circle")
	var circleAttributes = circles.attr("cx", 50).attr("cy", 50).attr("r", function(d) {
		return d;
	}).style("fill", function(d) {
		var returnColor;
		if (d === 40) {
			returnColor = "green";
		} else if (d === 20) {
			returnColor = "purple";
		} else if (d === 10) {
			returnColor = "red";
		}
		return returnColor;
	});
	var svgContainer2 = d3.select("body")
		.append("svg")
		.attr("width", 200)
		.attr("height", 200)
	// 	.style("border", "1px solid black");

	var jsonPolyline = {
		width: 50,
	}
	var polygon = svgContainer2.selectAll("polyline")
}

function lineGraph() {
	var lineData = [{
		"x": 1,
		"y": 5
	}, {
		"x": 20,
		"y": 20
	}, {
		"x": 40,
		"y": 10
	}, {
		"x": 60,
		"y": 40
	}, {
		"x": 80,
		"y": 5
	}, {
		"x": 100,
		"y": 60
	}, ];
	var lineFunction = d3.svg.line()
		.x(function(d) {
			return d.x;
		})
		.y(function(d) {
			return d.y;
		})
		.interpolate("linear");
	//svg container
	var svgContainer = d3.select("body").append("svg")
		.attr("width", 200)
		.attr("height", 200);

	//line svg path we draw
	var lineGraph = svgContainer.append("path")
		.attr("d", lineFunction(lineData))
		.attr("stroke", "blue")
		.attr("stroke-width", 2)
		.attr("fill", "none");

}

function circleGroup() {
	var circleData = [{
		"cx": 20,
		"cy": 20,
		"radius": 20,
		"color": "green"
	}, {
		"cx": 70,
		"cy": 70,
		"radius": 20,
		"color": "purple"
	}];


	var rectangleData = [{
		"rx": 110,
		"ry": 110,
		"height": 30,
		"width": 30,
		"color": "blue"
	}, {
		"rx": 160,
		"ry": 160,
		"height": 30,
		"width": 30,
		"color": "red"
	}];

	var svgContainer = d3.select("body").append("svg")
		.attr("width", 200)
		.attr("height", 200);

	//Add a group to hold the circles
	var circleGroup = svgContainer.append("g")
		.attr("transform", "translate(80,0)");;

	//Add circles to the circleGroup
	var circles = circleGroup.selectAll("circle")
		.data(circleData)
		.enter()
		.append("circle");

	var circleAttributes = circles
		.attr("cx", function(d) {
			return d.cx;
		})
		.attr("cy", function(d) {
			return d.cy;
		})
		.attr("r", function(d) {
			return d.radius;
		})
		.style("fill", function(d) {
			return d.color;
		});

	// * Note * that the rectangles are added to the svgContainer, not the circleGroup
	var rectangles = svgContainer.selectAll("rect")
		.data(rectangleData)
		.enter()
		.append("rect");

	var rectangleAttributes = rectangles
		.attr("x", function(d) {
			return d.rx;
		})
		.attr("y", function(d) {
			return d.ry;
		})
		.attr("height", function(d) {
			return d.height;
		})
		.attr("width", function(d) {
			return d.width;
		})
		.style("fill", function(d) {
			return d.color;
		});
}

function circleTextBinding() {
	//Circle Data Set
	var circleData = [{
		"cx": 20,
		"cy": 20,
		"radius": 20,
		"color": "green"
	}, {
		"cx": 70,
		"cy": 70,
		"radius": 20,
		"color": "purple"
	}];

	//Create the SVG Viewport
	var svgContainer = d3.select("body").append("svg")
		.attr("width", 200)
		.attr("height", 200);

	//Add circles to the svgContainer
	var circles = svgContainer.selectAll("circle")
		.data(circleData)
		.enter()
		.append("circle");

	//Add the circle attributes
	var circleAttributes = circles
		.attr("cx", function(d) {
			return d.cx;
		})
		.attr("cy", function(d) {
			return d.cy;
		})
		.attr("r", function(d) {
			return d.radius;
		})
		.style("fill", function(d) {
			return d.color;
		});

	//Add the SVG Text Element to the svgContainer
	var text = svgContainer.selectAll("text")
		.data(circleData)
		.enter()
		.append("text");

	//Add SVG Text Element Attributes
	var textLabels = text
		.attr("x", function(d) {
			return d.cx;
		})
		.attr("y", function(d) {
			return d.cy;
		})
		.text(function(d) {
			return "( " + d.cx + ", " + d.cy + " )";
		})
		.attr("font-family", "sans-serif")
		.attr("font-size", "15px")
		.attr("fill", "red");


}

function barchart() {
	//Width and height
	var w = 600;
	var h = 250;

	var dataset = generateData(25, 30);
	// console.log(d3.range(dataset.length))
	var xScale = d3.scale.ordinal()
		.domain(d3.range(dataset.length))
		.rangeRoundBands([0, w], 0.5);
	var yScale = d3.scale.linear()
		.domain([0, d3.max(dataset, function(d) {
			return d.value;
		})])
		.range([0, h]);

	//Define key function, to be used when binding data
	var key = function(d) {
		return d.key;
	};

	//Create SVG element
	var svg = d3.select("#displaySVG")
		.append("svg")
		.attr("width", w)
		.attr("height", h);


	var bars = svg.selectAll("rect")
		.data(dataset, key); //Bind data with custom key function

	var texts = svg.selectAll('text')
		.data(dataset, key); //Bind data
	//Create bars
	svg.selectAll("rect")
		.data(dataset, key) //Bind data with custom key function
	.enter()
		.append("rect")
		.attr("x", function(d, i) {
			console.log(xScale(i))
			return xScale(i);
		})
		.attr("y", function(d) {
			return h - yScale(d.value);
		})
		.attr("width", xScale.rangeBand())
		.attr("height", function(d) {
			return yScale(d.value);
		})
		.attr("fill", function(d) {
			return "rgb(0, 0, " + (d.value * 10) + ")";
		});
	//Create labels
	svg.selectAll("text")
		.data(dataset, key) //Bind data with custom key function
	.enter()
		.append("text")
		.text(function(d) {
			return d.value;
		})
		.attr("text-anchor", "middle")
		.attr("x", function(d, i) {
			return xScale(i) + xScale.rangeBand() / 2;
		})
		.attr("y", function(d) {
			return h - yScale(d.value) + 14;
		})
		.attr("font-family", "sans-serif")
		.attr("font-size", "11px")
		.attr("fill", "white");
	//On click, update with new data			
	d3.select("#update")
		.on("click", function() {
			//Remove one value from dataset
			// while (dataset.length > 0) {
			// 	dataset.shift();
			// }
			dataset.shift();
			// dataset = dataset;
			//Update scale domains
			xScale.domain(d3.range(dataset.length));
			yScale.domain([0, d3.max(dataset, function(d) {
				return d.value;
			})]);
			//Select…

			//Enter…
			bars.enter()
				.append("rect")
				.attr("x", w)
				.attr("y", function(d) {
					return h - yScale(d.value);
				})
				.attr("width", xScale.rangeBand())
				.attr("height", function(d) {
					return yScale(d.value);
				})
				.attr("fill", function(d) {
					return "rgb(0, 0, " + (d.value * 10) + ")";
				});
			//Update…
			bars.transition()
				.duration(500)
				.attr("x", function(d, i) {
					return xScale(i);
				})
				.attr("y", function(d) {
					return h - yScale(d.value);
				})
				.attr("width", xScale.rangeBand())
				.attr("height", function(d) {
					return yScale(d.value);
				});
			//Exit…
			bars.exit()
				.transition()
				.duration(1000)
				.attr("x", -xScale.rangeBand()) // <-- Exit stage left
			.remove();
			//Update all labels
			//
			//Exercise: Modify this code to remove the correct label each time!
			//
			svg.selectAll("text")
				.data(dataset, key) //Bind data with custom key function
			.transition()
				.duration(500)
				.text(function(d) {
					return d.value;
				})
				.attr("x", function(d, i) {
					return xScale(i) + xScale.rangeBand() / 2;
				})
				.attr("y", function(d) {
					return h - yScale(d.value) + 14;
				});
			texts.exit()
				.transition()
				.duration(500)
				.remove()
		});


	d3.select("#generate").on("click", function() {
		dataset = generateData(25, 50);
		// console.log(dataset);
		xScale.domain(d3.range(dataset.length));
		yScale.domain([0, d3.max(dataset, function(d) {
			return d.value;
		})]);
		//Select…
		var bars = svg.selectAll("rect")
			.data(dataset, key); //Bind data with custom key function

		var texts = svg.selectAll('text')
			.data(dataset, key); //Bind data
		//Enter…
		bars.enter()
			.append("rect")
			.attr("x", w)
			.attr("y", function(d) {
				return h - yScale(d.value);
			})
			.attr("width", xScale.rangeBand())
			.attr("height", function(d) {
				return yScale(d.value);
			})
			.attr("fill", function(d) {
				return "rgb(0, 0, " + (d.value * 10) + ")";
			});
		//Update…
		bars.transition()
			.duration(500)
			.attr("x", function(d, i) {
				return xScale(i);
			})
			.attr("y", function(d) {
				return h - yScale(d.value);
			})
			.attr("width", xScale.rangeBand())
			.attr("height", function(d) {
				return yScale(d.value);
			});
		//Update all labels
		//
		//Exercise: Modify this code to remove the correct label each time!
		//
		svg.selectAll("text")
			.data(dataset, key) //Bind data with custom key function
		.transition()
			.duration(500)
			.text(function(d) {
				return d.value;
			})
			.attr("x", function(d, i) {
				return xScale(i) + xScale.rangeBand() / 2;
			})
			.attr("y", function(d) {
				return h - yScale(d.value) + 14;
			});
	})
}

function circleChart() {
	var dataset = generateData(5, 20);
	console.log(dataset)
	var SVG_WIDTH = 600;
	var SVG_HEIGHT = 400;
	var circlePadding = 1;

	var xScale = d3.scale.ordinal()
		.domain(d3.range(dataset.length))



	var svg = d3.select('#displaySVG').append('svg')
		.attr('width', SVG_WIDTH)
		.attr('height', SVG_HEIGHT);
	var circles = svg.selectAll('circle')
		.data(dataset, function(d) {
			return d.key;
		})
		.enter()
		.append("circle");

	var circleAttributes = circles
		.attr("id", function(d) {
			return "circle" + d.value;
		})
		.attr("cx", function(d, i) {
			// return d.value * 10;
			console.log(getxAxis(dataset, i))
			console.log(i)
			console.log(dataset[i])
			return getxAxis(dataset, i);
		})
		.attr("cy", function(d) {
			return 100;
		})
		.attr("r", function(d) {
			return d.value;
		})
		.style("fill", function() {
			return "hsl(" + Math.random() * 360 + ",100%,50%)";

		})


};

function getxAxis(arr, index) {
	var xAxis = 100;
	if (index === 0) return 100;
	xAxis += arr[0].value;
	for (var i = 1; i < index; i++) {
		xAxis += arr[i].value * 2;
	}
	xAxis += arr[index].value;
	return xAxis;
}

function generateData(num, max) {
	//generate array of integer with leng:num and maxValue:max
	var arr = [];
	for (var i = 0; i < num; i++) {
		arr.push({
			key: i,
			value: Math.floor(Math.random() * max) + 3
		});
	}
	return arr;
}

function animate() {
	var SVG_WIDTH = 400;
	var SVG_HEIGHT = 400;
	var svg = d3.select('#displaySVG').append('svg')
		.attr('width', SVG_WIDTH)
		.attr('height', SVG_HEIGHT);


}