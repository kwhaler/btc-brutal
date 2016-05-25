
// closure to create private scope
var drawCircles = (function(){

var 
  w = 700,
  h = 700,
  r = 695,
  x = d3.scale.linear().range([0, r]),
  y = d3.scale.linear().range([0, r]),
  node,
  root;

var pack = d3.layout.pack()
    .size([r, r])
    .value(function(d) { return d.size; })

var vis = d3.select(".soi").insert("svg:svg")
    .attr("width", w)
    .attr("height", h)
  .append("svg:g")
    .attr("transform", "translate(" + (w - r) / 2 + "," + (h - r) / 2 + ")");

//  bind data
d3.json("data/soi-92.json", function(data) {

  node = root = data;
  var nodes = pack.nodes(root);        
  
  var formatIds = function(id){
    return id.replace(" ", "-").toLowerCase();
  }

  vis.selectAll("circle")
      .data(nodes)
    .enter().append("svg:circle")
      .attr("class", function(d) { return d.children ? "parent" : "child"; })
      .attr("cx", function(d) { return d.x; })
      .attr("cy", function(d) { return d.y; })
      .attr("r", function(d) { return d.r; })
      .attr("id", function(d) { return "elm-" + formatIds(d.name) })
      .on("click", function(d) { return zoom(node == d ? root : d); });

  vis.selectAll("text")
      .data(nodes)
    .enter().append("svg:text")
      .attr("class", function(d) { return d.children ? "parent" : "child"; })
      .attr("x", function(d) { return d.x; })
      .attr("y", function(d) { return d.y; })
      .attr("dy", ".35em")
      .attr("text-anchor", "middle")
      .attr("id", function(d) { return "str-" + formatIds(d.name) + "-" + d.size })
      .style("font-weight","bold")
      .style("opacity", function(d) { return d.r > 70 ? 1 : 0; })
      .text(function(d) { return d.name });

  d3.select(window).on("click", function() { zoom(root); });
  
});
  

function zoom(d, i) {

  var k = r / d.r / 2;
  x.domain([d.x - d.r, d.x + d.r]);
  y.domain([d.y - d.r, d.y + d.r]);

  var t = vis.transition()
      .duration(d3.event.altKey ? 7500 : 750);

  t.selectAll("circle")
      .attr("cx", function(d) { return x(d.x); })
      .attr("cy", function(d) { return y(d.y); })
      .attr("r", function(d) { return k * d.r; });

  t.selectAll("text")
      .attr("x", function(d) { return x(d.x); })
      .attr("y", function(d) { return y(d.y); })
      .style("opacity", function(d) { return k * d.r > 70 ? 1 : 0; });

    node = d;
    d3.event.stopPropagation();
  }

})();