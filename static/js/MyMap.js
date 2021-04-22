function myMap(data){
    // The svg
    console.log(data);
    // var svg = d3.select("#div2")
    //             .append("svg");
    // var svg = d3.select("svg"),
    // width = +svg.attr("width"),
    // height = +svg.attr("height");

    // var svg = d3.select("#div4")
    //     .append("svg")
    //     .attr("width", width + margin.left + margin.right)
    //     .attr("height", height + margin.top + margin.bottom)
    //     .append("g")
    //     .attr("transform",
    //         "translate(" + margin.left + "," + margin.top + ")")
    
    width = 600;
    height = 400;
    var svg = d3.select("#div2")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    // Map and projection
    var projection = d3.geoNaturalEarth()
    .scale(width / 1.3 / Math.PI)
    .translate([width / 2, height / 2])

    // Draw the map
    svg.append("g")
        .selectAll("path")
        .data(data.features)
        .enter().append("path")
            .attr("fill", "#69b3a2")
            .attr("d", d3.geoPath()
                .projection(projection)
            )
            .style("stroke", "#fff")
}