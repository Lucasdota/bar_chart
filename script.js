import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

const url =
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json";
let req = new XMLHttpRequest();

let data;
let values = [];

let heightScale;
let xScale;
let xAxisScale;
let yAxisScale;

const width = 800;
const height = 600;
const padding = 60;

const svg = d3.select("svg");

const drawCanvas = () => {
  svg.attr("width", width);
  svg.attr("height", height);
};

const generateScales = () => {
	heightScale = d3.scaleLinear()
									.domain([0, d3.max(values, (item) => item[1])])
									.range([0, height - (2 * padding)])

	xScale = d3.scaleLinear()
						 .domain([0, values.length - 1])
						 .range([padding, width - padding])
						 
	const datesArray = values.map((item) => {
		return new Date(item[0])
	})	
	
	xAxisScale = d3.scaleTime()
								 .domain([d3.min(datesArray), d3.max(datesArray)])
								 .range([padding, width - padding])

	yAxisScale = d3.scaleLinear()
								 .domain([0, d3.max(values, (item) => item[1])])
								 .range([height - padding, padding])							 							 
};								

const drawBars = () => {
	svg
    .selectAll("rect")
    .data(values)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("width", (width - 2 * padding) / values.length)
    .attr("data-date", (item) => item[0])
    .attr("data-gdp", (item) => item[1])
    .attr("height", (item) => heightScale(item[1]))
    .attr("x", (item, index) => xScale(index))
    .attr("y", (item) => height - padding - heightScale(item[1]))
    .attr("fill", "darkseagreen")
    .append("title")
    .attr("id", "tooltip")
    .attr("data-date", (item) => item[0])
    .text((item) => item[0]);
};

const generateAxes = () => {
	const xAxis = d3.axisBottom(xAxisScale)			
	const yAxis = d3.axisLeft(yAxisScale)	

	svg.append("g")
		 .call(xAxis)
		 .attr("id", "x-axis")
		 .attr("transform", "translate(0, " + (height - padding) + ")")

	svg.append("g")
		 .call(yAxis)
		 .attr("id", "y-axis")
		 .attr("transform", "translate(" + padding + ", 0)")	 
};

req.open("GET", url, true);
req.onload = () => {
  data = JSON.parse(req.responseText)
  values = data.data
  console.log(values)
	drawCanvas()
	generateScales()
	drawBars()
	generateAxes()
};
req.send();
