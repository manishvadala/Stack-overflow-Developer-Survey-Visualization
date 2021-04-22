function parallel_coordinates_plot(featureNames, values, kmeans){
    d3.select("svg").remove();
    d3.select("table").remove();
    var combineValues = new Array(values.length);
    combineValues[0] = featureNames;
    for(var i=0; i<values.length; i++){
        combineValues[i+1] = values[i];
    }
    // console.log(combineValues);
    // console.log(combineValues[0]);
    // console.log(combineValues[101]);
    // console.log(kmeans);

    var margin = {top: 100, right: 10, bottom: 10, left: 50},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

    var x = d3.scalePoint().range([0, width], 1),
    y = {},
    dragging = {};

    var line = d3.line(),
    axis = d3.axisLeft(y),
                background,
                foreground;

    var svg = d3.select("#divX").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
    
    dimensions = d3.keys(combineValues[0]).filter(function(d) {
        temp = (y[d] = d3.scaleLinear()
        .domain(d3.extent(combineValues, function(p){
            // console.log(d);
            // console.log(p);
            // console.log(p[d]);
            return +p[d];
        }))
        .range([height, 0]));
        //console.log(temp);
        return temp;
    })

    console.log("dimensions ", dimensions)
    //Extract the list of dimensions and create a scale for each.
    //x.domain();
    x.domain(dimensions);

    // Add grey background lines for context.
    background = svg.append("g")
    .attr("class", "background")
    .selectAll("path")
    .data(combineValues)
    .enter().append("path")
    .attr("d", path);

    // Add blue foreground lines for focus.
    foreground = svg.append("g")
    .attr("class", "foreground")
    .selectAll("path")
    .data(combineValues)
    .enter().append("path")
    .attr("d", path)
    .attr("stroke", function (d, i) { 
        //console.log(kmeans[i]);
        return get_kcolor(kmeans[i]) } );


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
    return line(dimensions.map(function(p) { return [position(p), y[p](d[p])]; }));
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
                return active.extent[0] <= y[dim](d[dim]) && y[dim](d[dim]) <= active.extent[1];
            }) ? null : "none";
        });
    }

    function brushend() {
        //console.log("to end the brush");
        var e = d3.brushSelection(this);
        if (e === null) svg.selectAll(".brush").style("display", "none");
    }
}