var drawBars = (function(){

var data = {
labels: [
  'Support', 'Oppose'
],
series: [
  {
    label: 'Raised',
    values: [11256754.65, 20881181.73]
  },
  {
    label: 'Spent',
    values: [10943706.61,20477544.17]
  }]
};

var chartWidth       = 600,
  barHeight        = 35,
  groupHeight      = barHeight * data.series.length,
  gapBetweenGroups = 15,
  spaceForLabels   = 55,
  spaceForLegend   = 150,
  format           = d3.format(",.2f");

// Zip the series data together (first values, second values, etc.)
var zippedData = [];
for (var i=0; i<data.labels.length; i++) {
for (var j=0; j<data.series.length; j++) {
  zippedData.push(data.series[j].values[i]);
}
}

// Color scale
var color = d3.scale.linear().range(['#FFF','#EEE']);
var chartHeight = barHeight * zippedData.length + gapBetweenGroups * data.labels.length;

var x = d3.scale.linear()
  .domain([0, d3.max(zippedData)])
  .range([0, chartWidth]);

var y = d3.scale.linear()
  .range([chartHeight + gapBetweenGroups, 0]);

var yAxis = d3.svg.axis()
  .scale(y)
  .tickFormat('')
  .tickSize(0)
  .orient("left");

// Specify the chart area and dimensions
var chart = d3.select("#raised_spent")
  .attr("width", spaceForLabels + chartWidth + spaceForLegend)
  .attr("height", chartHeight);

// Create bars
var bar = chart.selectAll("g")
  .data(zippedData)
  .enter().append("g")
  .attr("transform", function(d, i) {
    return "translate(" + spaceForLabels + "," + (i * barHeight + gapBetweenGroups * (0.5 + Math.floor(i/data.series.length))) + ")";
  });

// Create rectangles of the correct width
bar.append("rect")
  .attr("fill", function(d,i) { return color(i % data.series.length); })
  .attr("class", "bar")
  .attr("width", x)
  .attr("height", barHeight - 1);

// Add text label in bar
bar.append("text")
  .attr("x", function(d) { return x(d) - 3; })
  .attr("y", barHeight / 2)
  .attr("fill", "red")
  .attr("dy", ".35em")
  .text(function(d) { return "$" + format(d); });

// Draw labels
bar.append("text")
  .attr("class", "label")
  .attr("x", function(d) { return - 10; })
  .attr("y", groupHeight / 2)
  .attr("dy", ".35em")
  .text(function(d,i) {
    if (i % data.series.length === 0)
      return data.labels[Math.floor(i/data.series.length)];
    else
      return ""});

chart.append("g")
    .attr("class", "y axis")
    .attr("transform", "translate(" + spaceForLabels + ", " + -gapBetweenGroups/2 + ")")
    .call(yAxis);

// Draw legend
var legendRectSize = 18,
  legendSpacing  = 4;

var legend = chart.selectAll('.legend')
  .data(data.series)
  .enter()
  .append('g')
  .attr('transform', function (d, i) {
      var height = legendRectSize + legendSpacing;
      var offset = -gapBetweenGroups/2;
      var horz = spaceForLabels + chartWidth + 40 - legendRectSize;
      var vert = i * height - offset;
      return 'translate(' + horz + ',' + vert + ')';
  });

legend.append('rect')
  .attr('width', legendRectSize)
  .attr('height', legendRectSize)
  .attr('class','legend_swatch')
  .style('fill',   function (d, i) { return color(i); });
  // .style('stroke', function (d, i) { return color(i); });

legend.append('text')
  .attr('class', 'legend')
  .attr('x', legendRectSize + legendSpacing)
  .attr('y', legendRectSize - legendSpacing)
  .text(function (d) { return d.label; });

})();