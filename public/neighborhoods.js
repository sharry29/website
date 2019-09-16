var pcts;
var i = 0;
var x, xAxis, y, yAxis, t;

d3.csv("https://raw.githubusercontent.com/sharry29/DataStoryPractice/master/02-NYT_Neighborhoods/yearly_white_pcts.csv", 
	function (data) {
		return {
			pct_white_1980: +data.pct_white_1980,
			pct_white_1990: +data.pct_white_1990,
			pct_white_2000: +data.pct_white_2000,
			pct_white_2010: +data.pct_white_2010,
		}
	}
).then(accumulateData);


function accumulateData(data) {
	pcts = [data.map(d => d.pct_white_1980), data.map(d => d.pct_white_1990), data.map(d => d.pct_white_2000), data.map(d => d.pct_white_2010)]
	setUpChart(0);
}

const height = 550;
const width = 1200;
const margin = ({top: 20, right: 20, bottom: 30, left: 40});
const svg = d3.select("#svgcontainer").append("svg").attr("width", width).attr("height", height);
function setUpChart (i) {
  x = d3.scaleLinear()
    .domain(d3.extent(pcts[i])).nice()
    .range([margin.left, width - margin.right]);
  
  xAxis = g => g
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x).tickSizeOuter(0).tickFormat(d3.format(".0%")))
    .call(g => g.append("text")
        .attr("x", width - margin.right)
        .attr("y", -4)
        .attr("fill", "#000")
        .attr("font-weight", "bold")
        .attr("text-anchor", "end"));

  var bins = d3.histogram()
    .domain(x.domain())
    .thresholds(x.ticks(50))(pcts[i])
  y = d3.scaleLinear()
    .domain([0, d3.max(bins, d => d.length)]).nice()
    .range([height - margin.bottom, margin.top]);
  yAxis = g => g
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(y))
    .call(g => g.select(".domain").remove())
    .call(g => g.select(".tick:last-of-type text").clone()
        .attr("x", 4)
        .attr("text-anchor", "start")
        .attr("font-weight", "bold"));
  
  t = d3.transition()
    .duration(2000)
    .ease(d3.easeLinear);
   
  const bar = svg.append("g")
      .attr("fill", "steelblue")
    .selectAll("rect")
    .data(bins)
    .join("rect")
	.attr("x", d => x(d.x0) + 1)
	.attr("width", d => Math.max(0, x(d.x1) - x(d.x0) - 1))
	.attr("height", d =>  y(0) - y(d.length))
	.attr("y", d => y(d.length));

  svg.append("g")
      .call(xAxis);
  
  svg.append("g")
      .call(yAxis);
  
  return svg.node();
}

function chart (i) {
  var bins = d3.histogram()
    .domain(x.domain())
    .thresholds(x.ticks(40))(pcts[i])
   
  const bar = svg.select("g")
    .selectAll("rect")
    .data(bins)
	.transition(t).duration(2000)
	.attr("y", d => y(d.length))
	.attr("height", d => y(0) - y(d.length));
  
  return svg.node();
}
d3.interval(function () {
	if (i == 3) {i = 0;}
	else {i += 1;}
	chart(i);
}, 4000)


