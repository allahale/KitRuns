$(function() {
    // let's get started

    var totalWidth = 700;
    var totalHeight = 500;
    // set margins
    var margin = {top: 20, right: 20, bottom: 30, left: 40},
        width = totalWidth - margin.left - margin.right,
        height = totalHeight - margin.top - margin.bottom;


//    var dataset; //Declare global variable, initially empty

    // add graph to the webpage
    var svg = d3.select("div#overall_runs")
      .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.bottom + margin.top)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // load our activity data
    d3.csv("data/Kit_Activities.csv").then(function(data){
        dataset = data;
      data.forEach(function(d){
        var timeArray = d['Avg Pace'].split(':');
        d.avgPace = parseInt(timeArray[0]) + parseInt(timeArray[1])/60;
        d.elevGain = parseFloat(d['Elev Gain']);
        d.dist = parseFloat(d['Distance']);
        });

      // setup x
      // distance
      var xScale = d3.scaleLinear()
                     .domain([0, d3.max(dataset, function(d){ return d.dist; })])
                     .range([0, width]);
      var xAxis = d3.axisBottom(xScale);

      // setup y
      // elevation gain
      var yScale = d3.scaleLinear()
                     .domain([0, d3.max(dataset, function(d){ return d.elevGain; })])
                     .range([height, 0]);
      var yAxis = d3.axisLeft(yScale);

      // setup color scale for pace
//      var colorScale = d3.scaleQuantile()
//        .domain([d3.min(dataset, function(d){return d.avgPace; }), d3.max(dataset, function(d){return d.avgPace; })])
//        .range(d3.schemeRdYlBu[8]);
      var colorScale = d3.scaleThreshold()
        .domain([6,8,10,15,20,25,30])
        .range(d3.schemeRdYlBu[8]);

      // Create scatterplot of pace vs. elevation gain
      // draw axes
      // x-axis
      svg.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis)
      svg.append("text")
          .attr("class", "label")
          .attr("x", width)
          .attr("y", height - 6)
          .style("text-anchor", "end")
          .text("Distance (miles)")

      // y-axis
      svg.append("g")
          .attr("class", "y axis")
          .call(yAxis)
      svg.append("text")
          .attr("class", "label")
          .attr("transform", "rotate(-90)")
          .attr("x", 2)
          .attr("y", 12)
          .style("text-anchor", "end")
          .text("Total Elevation Gain (ft)")

      // draw points
      svg.selectAll("circle")
         .data(dataset)
         .enter()
       .append("circle")
         .attr("class", "circle")
         .attr("cx", function(d) {
            console.log(d)
            return xScale(d.dist);
         })
         .attr("cy", function(d) {
            return yScale(d.elevGain);
         })
         .attr("r", 5)
         .attr("fill", function(d,i) {
            return colorScale(d.avgPace);
         })
         .attr("opacity", .8)

         // add a tooltip on mouseover
         .on("mouseenter", function(d,i) {
           var xPosition = parseFloat(d3.select(this).attr("cx"));
            var yPosition = parseFloat(d3.select(this).attr("cy"));
            d3.select(this).attr("r", 10)
            svg.append("text")
              .attr("id","tooltip")
              .attr("x", xPosition)
              .attr("y", yPosition)
              .text(d.Date);
         })
         .on("mouseleave", function() {
            d3.select("#tooltip").remove()
            d3.select(this).attr("r", 5)
         });

      // the legend
      svg.append("g")
        .attr("class", "legend")
        .attr("transform", function(d,i){
            return "translate(" + (width - 80) + "," + (height - 200) + ")";
        });

      var legendLinear = d3.legendColor()
        .title("Pace (min/mile)")
        .ascending(true)
        .labelAlign("end")
        .scale(colorScale);

      svg.select(".legend")
        .call(legendLinear);

    })

    });

