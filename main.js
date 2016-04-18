var margin = {top: 20, right: 20, bottom: 30, left: 50},
  width = 700 - margin.left - margin.right,
  height = 500 - margin.top - margin.bottom

var x = d3.scale.linear()
  .range([0, width]);

var y = d3.scale.linear()
  .range([height, 0]);

var color = d3.scale.category10();

var xAxis = d3.svg.axis()
  .scale(x)
  .orient("bottom");

var yAxis = d3.svg.axis()
  .scale(y)
  .orient("left");

var svg = d3.select("body").append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
      .append("text")
      .attr("class", "xlabel")
      .attr("x", width)
      .attr("y", -6)
      .style("text-anchor", "end")
      .text('mpg');

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .append("text")
      .attr("class", "ylabel")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text('mpg');

// function: loadData
var loadData = function(xText, yText) {
    var min_value = $('#mpg-min').val();
    var max_value = $('#mpg-max').val();
    // console.log(max_value)
    d3.csv("car.csv", function(error, data) {
      data = data.filter(function(d) {
          return max_value-d.mpg>=0 && d.mpg - min_value>= 0;
        })
      if (error) throw error;
      data.forEach(function(d) {
        d[xText] = +d[xText];
        d[yText] = +d[yText];
        d['mpg'] = +d['mpg'];
        // console.log(Math.max(d['mpg']));
      });
      // console.log(data.length);
      x.domain(d3.extent(data, function(d) { return d[xText]; })).nice();
      y.domain(d3.extent(data, function(d) { return d[yText]; })).nice();

      var x_axis = svg.selectAll("g.x.axis")
                    .call(xAxis);
      svg.selectAll(".xlabel").text(xText);
      svg.selectAll(".ylabel").text(yText);
      var y_axis = svg.selectAll("g.y.axis")
                    .call(yAxis);

      var dots = svg.selectAll(".dot").data(data);
      dots.enter().append("circle");
      dots
        .attr("class", "dot")
        .attr("r", 4.5)
        .attr("cx", function(d) { return x(d[xText]); })
        .attr("cy", function(d) { return y(d[yText]); })
        .style("fill", function(d) {
          return color(d['mpg']); })
        .on('mouseover', function(d) {
          d3.select('#hovered')
            .text(d.name)
            .transition()
            .style('opacity', 1)
        })
        .on('mouseout', function(d) {
          d3.select('#hovered')
            .transition()
            .duration(8000)
            .style('opacity', 0);
        });
      dots.exit().remove();
    });
};

var cars = [
{
  id:'mpg'
},
{
  id:'cylinders',
},
{
  id:'horsepower',
},
{
  id:'weight',
},
{
  id:'acceleration',
},
{
  id:'model.year',
},
];

function addListeners(){
  $('#update').on('click',function(){
    t1 = $('#sel-x').find("option:selected").text();
    t2 = $('#sel-y').find("option:selected").text();
    loadData(t1,t2);
  })
}

$(document).ready(function(){
  var select = $('select');
  for (var i=0; i<cars.length; i++){
    var car = cars[i];
    $('<option></option>')
    .val(car.id)
    .text(car.id)
    .appendTo(select);
  }
  loadData('mpg', 'mpg');
});

$(document).ready(function() {
    $('#sel-x').change(function() {
        var t1 = $('#sel-x').find("option:selected").text();
        var t2 = $('#sel-y').find("option:selected").text();
        loadData(t1, t2);
    });
    $('#sel-y').change(function() {
        var t1 = $('#sel-x').find("option:selected").text();
        var t2 = $('#sel-y').find("option:selected").text();
        loadData(t1, t2);
    });
    addListeners();
});
