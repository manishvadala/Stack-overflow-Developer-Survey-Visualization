function parallel_coordinates_plot(featureNames, values){
    console.log(featureNames);
    console.log(values);
    d3.select("#div3").select("svg").remove();
    // featureNames = [
    //     "Games Played",
    //     "Field Goals Made",
    //     "Field Goals Attempted",
    //     "3Pointers Made",
    //     "3Pointers Attempted",
    //     "Free Throws Made",
    //     "Free Throws Attempted",
    //     "Personal Fouls",
    //     "Offensive Rebounds",
    //     "Defensive Rebounds",
    //     "height_cm",
    //     "weight"
    // ]
    // pcpCategories = ["cat","num","num","num","num","num","num","num","num","num","num","num",]
    // values = [
    //     [
    //         "aa",
    //         956,
    //         1665,
    //         0,
    //         1,
    //         432,
    //         824,
    //         255,
    //         336,
    //         742,
    //         216,
    //         325
    //     ],
    //     [
    //         "dd",
    //         800,
    //         1696,
    //         95,
    //         236,
    //         436,
    //         551,
    //         263,
    //         150,
    //         326,
    //         198,
    //         220
    //     ],
    //     [
    //         "bb",
    //         752,
    //         1476,
    //         2,
    //         8,
    //         589,
    //         739,
    //         229,
    //         169,
    //         610,
    //         206,
    //         265
    //     ]
    // ]
    featureNames = ["YearsCodePro", "Education Level", "ConvertedComp", "JobSeek", "WorkWeekHrs", "JobSat"]
    pcpCategories = ["num", "cat", "num", "cat", "num", "cat"]
    console.log(featureNames)
    //console.log(values)
    var combineValues = new Array(values.length);
    combineValues[0] = featureNames;
    for(var i=0; i<values.length; i++){
        combineValues[i+1] = values[i];
    }
    //console.log(combineValues);
    // console.log(combineValues[0]);
    // console.log(combineValues[101]);
    // console.log(kmeans);

    var margin = {top: 100, right: 10, bottom: 10, left: 50},
    width = 860 - margin.left - margin.right,
    height = 430 - margin.top - margin.bottom;

    var x = d3.scalePoint().range([0, width], 1),
    y = {},
    dragging = {};

    var line = d3.line(),
    axis = d3.axisLeft(y),
                background,
                foreground;

    var svg = d3.select("#div3").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
    
    dimensions = d3.keys(values[0]).filter(function(d) {
        if (pcpCategories[d] == "num") {
            temp = (y[d] = d3.scaleLinear()
                .domain(d3.extent(values, function(p) {
                    return +p[d];
                }))
                .range([height, 0]));
            return temp;
        } else if (pcpCategories[d] == "cat") {
            temp = (y[d] = d3.scaleBand()
                .domain(values.map(function(value, index) { return value[d]; }))
                .range([0, height]));
            return temp;
        }
    })

    console.log("dimensions ", dimensions)
    //Extract the list of dimensions and create a scale for each.
    //x.domain();
    x.domain(dimensions);
    console.log(x)
    console.log(y)

    // Add grey background lines for context.
    background = svg.append("g")
    .attr("class", "background")
    .selectAll("path")
    .data(combineValues)
    .enter().append("path")
    .attr("d", path);

    var colorScale = d3.scaleThreshold()
      .domain([0, 200000, 500000, 1000000, 1500000, 2000000])
      .range(d3.schemeBlues[7]);
    
    // Add blue foreground lines for focus.
    foreground = svg.append("g")
    .attr("class", "foreground")
    .selectAll("path")
    .data(combineValues)
    .enter().append("path")
    .attr("d", path)
    .attr("stroke", function (d, i) { 
        //console.log("checkingrababu", d[i]);
        return colorScale(d[2]) } );


    // Add a group element for each dimension.
    var g = svg.selectAll(".dimension")
    .data(dimensions)
    .enter().append("g")
    .attr("class", "dimension")
    .attr("transform", function(d) { return "translate(" + x(d) + ")"; })
    .call(d3.drag()
        .on("start", function(d) {
        dragging[d] = x(d);
        background.attr("visibility", "hidden");
        })
        .on("drag", function(d) {
        dragging[d] = Math.min(width, Math.max(0, d3.event.x));
        foreground.attr("d", path);
        dimensions.sort(function(a, b) { return position(a) - position(b); });
        x.domain(dimensions);
        g.attr("transform", function(d) { return "translate(" + position(d) + ")"; })
        })
        .on("end", function(d) {
        delete dragging[d];
        transition(d3.select(this)).attr("transform", "translate(" + x(d) + ")");
        transition(foreground).attr("d", path);
        background
            .attr("d", path)
            .transition()
            .delay(500)
            .duration(0)
            .attr("visibility", null);
        }));

    // Add an axis and title.
    g.append("g")
    .attr("class", "axis")
    .each(function(d) { d3.select(this).call(axis.scale(y[d])); })
    .append("text")
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "start")
    .attr("stroke", "steelblue")
    .attr("y", -9)
    .text(function(d) { 
        //console.log("labelling", d);
        //console.log(combineValues[0][d]);
        return combineValues[0][d]; });

    // Add and store a brush for each axis.
    g.append("g")
    .attr("class", "brush")
    .each(function(d) {
        d3.select(this).call(y[d].brush = d3.brushY().extent([[-8,0], [8,height]]).on("start", brushstart).on("brush", brush)).on("end", brushend);
        //d3.select(this).call(y[d].brush = d3.brushY().extent([[-8, y[d].range()[1]],[-8, y[d].range()[0]]]).on("start", brushstart).on("brush", brush));
    })
    .selectAll("rect")
    .attr("x", -8)
    .attr("width", 16);

    function position(d) {
        var v = dragging[d];
        return v == null ? x(d) : v;
    }
      
    function transition(g) {
    return g.transition().duration(500);
    }
    
    // Returns the path for a given data point.
    function path(d) {
        return line(dimensions.map(function(p) {
            if(pcpCategories[p] == "num")
                return [position(p), y[p](d[p])];
            else
                return [position(p), y[p](d[p]) + y[p].bandwidth() / 2];
        }));
        }
    
      
    function brushstart() {
    d3.event.sourceEvent.stopPropagation();
    }
    
    // Handles a brush event, toggling the display of foreground lines.
    // function brush() {
    //     var actives = dimensions.filter(function(p) { return !(d3.event.selection === null); }),
    //         extents = actives.map(function(p) { return y[p].brush.extent(); });
    //     foreground.style("display", function(d) {
    //       return actives.every(function(p, i) {
    //         return extents[i][0] <= d[p] && d[p] <= extents[i][1];
    //       }) ? null : "none";
    //     });
    //   }
    function brush() {
        const actives = [];
        svg.selectAll('.brush')
            .filter(function(d) {
                return d3.brushSelection(this);
            })
            .each(function(d){
                actives.push({
                    dimension: d,
                    extent: d3.brushSelection(this)
                });
            });
        foreground.style('display', function(d) {
            return actives.every(function(active) {
                const dim = active.dimension;
                if(pcpCategories[dim] == "num")
                    return active.extent[0] <= y[dim](d[dim]) && y[dim](d[dim]) <= active.extent[1];
                else
                    return active.extent[0] <= (y[dim](d[dim]) + y[dim].bandwidth()/2) && (y[dim](d[dim]) + y[dim].bandwidth()/2) <= active.extent[1];
                
            }) ? null : "none";
        });
    }

    function brushend() {
        //console.log("to end the brush");
        var e = d3.brushSelection(this);
        if (e === null) svg.selectAll(".brush").style("display", "none");
    }
}