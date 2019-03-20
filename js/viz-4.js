var paceChart = dc.barChart("#paceBars"),
      timeChart = dc.barChart("#time"),
      filterScatter = dc.scatterPlot("#scatterChart");

      d3.csv("data/Kit_Activities.csv").then(function (data) {
      //Activity Type,Date,Favorite,Title,Distance,Calories,Avg Run Cadence,Max Run Cadence,Avg Pace,Best Pace,Elev Gain,Elev Loss,Avg Stride Length,Avg Vertical Ratio,Avg Vertical Oscillation,Training Stress Scoreå¨,Grit,Flow,Bottom Time,Min Water Temp,Surface Interval,Decompression
      //running,1/24/19 19:11,FALSE,South San Francisco Running,9,947,159,225,9:17,7:26,2377,2372,1.09,0,0,0,0,0,0:00,0,0:00,No
      //running,1/23/19 20:15,FALSE,South San Francisco Running,6.5,679,158,225,8:50,6:59,1687,1689,1.15,0,0,0,0,0,0:00,0,0:00,No
        dataset = data;
      data.forEach(function (d) {
        d.Date = new Date(d.Date);
        var timeArray = d['Avg Pace'].split(':');
        d.avgPace = parseInt(timeArray[0]) + parseInt(timeArray[1])/60;
        d.elevGain = parseFloat(d['Elev Gain']);
        d.dist = parseFloat(d['Distance']);
//        console.log(d.Date);
      });

      // setup color scale for pace
      var colorScale = d3.scaleThreshold()
            .domain([6,8,10,15,20,25,30])
            .range(d3.schemeRdYlBu[8])

      var ndx = crossfilter(data);
      var all = ndx.groupAll();

      var paceDim = ndx.dimension(function (d) { return d.avgPace; });
      var dateDim = ndx.dimension(function (d) { return d.Date.getHours(); });
      var scatterDim = ndx.dimension(function(d) { return [d.dist, d.elevGain]});

      var paceGroup = paceDim.group();
      var dateGroup = dateDim.group();
      var scatterGroup = scatterDim.group();

      timeChart
        .x(d3.scaleLinear().domain([0,23]))
        .round(Math.floor())
        .dimension(dateDim)
        .group(dateGroup)
        .yAxisLabel("Run Count")
        .xAxisLabel("Hour of the Day");
        <!--.elasticX(true);-->

      paceChart
        .x(d3.scaleLinear()
            .domain([d3.min(dataset, function(d){return d.avgPace; }), d3.max(dataset, function(d){ return d.avgPace; })])
            )
        .round(Math.floor())
        .dimension(paceDim)
        .group(paceGroup)
        .yAxisLabel("Run Count")
        .xAxisLabel("Pace (min/mile)");

      filterScatter
        .width(700)
        .height(500)
        .x(d3.scaleLinear()
            .domain([d3.min(dataset, function(d){return d.dist; }) -1 , d3.max(dataset, function(d){ return d.dist; }) + 1])
            )
        .y(d3.scaleLinear()
            .domain([d3.min(dataset, function(d){return d.elevGain; }), d3.max(dataset, function(d){ return d.elevGain; }) + 150])
            )
        .dimension(scatterDim)
        .group(scatterGroup)
        //I couldn't quite get the colors to work. That's for the next project.
//        .colors(colorScale = d3.scaleThreshold()
//            .domain([6,8,10,15,20,25,30])
//            .range(d3.schemeRdYlBu[8])
//          )
//        .colorAccessor(function(data, i) {
//            console.log(data.avgPace)
//            return colorScale(data.avgPace);
//            })
        .symbolSize([10])

        .xAxisLabel("Distance (miles)")
        .yAxisLabel("Total Elevation Gain (ft)");

       filterScatter.margins().left += 40

      dc.renderAll();

    });