const pad = 22;
const margin = { top: pad, left: pad, right: pad, bottom: pad };
const width = 250 - margin.left - margin.right;
const height = 250 - margin.top - margin.bottom;
const sw = 30;
const radius = height / 2;
const line_w = radius / 10;

var tau = 2 * Math.PI;

function responsivefy(svg) {
  // get container + svg aspect ratio
  var container = d3.select(svg.node().parentNode),
    width = parseInt(svg.style("width")),
    height = parseInt(svg.style("height")),
    aspect = width / height;

  // add viewBox and preserveAspectRatio properties,
  // and call resize so that svg resizes on inital page load
  svg
    .attr("viewBox", "0 0 " + width + " " + height)
    .attr("perserveAspectRatio", "xMinYMid")
    .call(resize);

  d3.select(window).on("resize." + container.attr("id"), resize);

  // get width of container and resize svg to fit it
  function resize() {
    var targetWidth = parseInt(container.style("width"));
    svg.attr("width", targetWidth);
    svg.attr("height", Math.round(targetWidth / aspect));
  }
}
const canvas = d3
  .select("#doodle")
  .append("svg")
  .attr("height", height + margin.top + margin.bottom)
  .attr("width", width + margin.left + margin.right);

canvas.call(responsivefy);

const svg = canvas
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
  .append("g")
  .attr("transform", `translate(${width / 2}, ${height / 2})`);
console.log(canvas);

const angleScale = d3
  .scaleLinear()
  .domain([0, 1])
  .range([0, Math.PI * 2]);

const radiusScale = d3
  .scaleOrdinal()
  .domain([0, 1, 2])
  .range([radius - line_w, radius, radius + line_w]);

const colorScale = d3
  .scaleOrdinal()
  .domain([0, 1, 2])
  .range(["#1f77b4", "#ff7f0e", "#db2822"]);

const arc = d3.arc();

const rand = d3.randomUniform();
var datapoints = [
  {
    innerRadius: radiusScale(0),
    outerRadius: radiusScale(0) + line_w,
    startAngle: 0,
    endAngle: 0.1,
  },
  {
    innerRadius: radiusScale(1),
    outerRadius: radiusScale(1) + line_w,
    startAngle: 0,
    endAngle: 0.1,
  },
  {
    innerRadius: radiusScale(2),
    outerRadius: radiusScale(2) + line_w,
    startAngle: 0,
    endAngle: 0.1,
  },
];

console.log(datapoints);
const arcs = svg
  .selectAll(".arc")
  .data(datapoints)
  .enter()
  .append("path")
  .attr("d", arc)
  .attr("fill", (d, i) => colorScale(i))
  .attr("stroke", "none");

console.log(arcs);
d3.interval(function () {
  arcs.transition().duration(2000).attrTween("d", arc2Tween);
}, 3000);

function arc2Tween(d) {
  var interp = d3.interpolate(this._current, d); // this will return an interpolater
  //  function that returns values
  //  between 'this._current' and 'd'
  //  given an input between 0 and 1

  this._current = d; // update this._current to match the new value

  return function (t) {
    // returns a function that attrTween calls with
    //  a time input between 0-1; 0 as the start time,
    //  and 1 being the end of the animation

    var tmp = interp(t); // use the time to get an interpolated value
    //  (between this._current and d)

    return arcStartTween(tmp);
  };
}
function arcStartTween(d) {
  var interpolateStart = d3.interpolate(d.endAngle, d.endAngle + 3);
  var interpolateEnd = d3.interpolate(d.startAngle, d.endAngle - 0.05);
  return function (t) {
    d.startAngle = interpolateEnd(t);
    d.endAngle = interpolateStart(t);
    return arc(d);
  };
}

function arcEndTween() {
  return function (d) {
    var interpolateEnd = d3.interpolate(d.endAngle, d.endAngle + 0.2);
    // var interpolateEnd = d3.interpolate(d.end, d.end + newAngle);
    return function (t) {
      d.endAngle = interpolateEnd(t);
      return arc(d);
    };
  };
}
