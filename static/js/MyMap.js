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
    

    var margin = {top: 30, right: 30, bottom: 70, left: 60},
    width = 760 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3.select("#div2")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");
    // width = 600;
    // height = 400;
    // var svg = d3.select("#div2")
    //     .append("svg")
    //     .attr("width", width)
    //     .attr("height", height);

    // Map and projection
    var projection = d3.geoNaturalEarth()
    .scale(width / 1.3 / Math.PI)
    .translate([width / 2, height / 2])

    var mouseOver = function(d) {
        d3.selectAll(".Country")
        .transition()
        .duration(200)
        .style("opacity", .5)
        console.log("this value",d.properties.name);
        d3.select(this)
        .transition()
        .duration(200)
        .style("opacity", .8)
        .style("stroke", "white")
        
        data = JSON.stringify({
            "_display":"ConvertedComp",
            "_filters":{"Country" : d.properties.name}
        })

        var settings = {
            "async": true,
            "crossDomain": true,
            "url": "/worldmap",
            "method": "POST",
            "headers": {
              "content-type": "application/json",
              "cache-control": "no-cache",
              "postman-token": "e992363a-3c8c-81f0-089e-3dffb472c2b2"
            },
            "processData": false,
            "data": data
          }
          
          $.ajax(settings).done(function (response) {
            console.log(response);
            console.log(response.avg_salary);
            coordinates = d.geometry.coordinates
            var xtip = 100;//coordinates[0][0];
            var ytip = 100;//coordinates[0][1];
            
            console.log("xtip is==>",xtip);
            svg.append("g").append("text")
                        .text(Math.floor(response.avg_salary)+" $")
                        .attr("id", "tooltext")
                        .attr("stroke", "#377eb8")
                        .attr("transform", function(d) { return "translate(" + xtip + "," + ytip + ")"; });

        });
        
    }

    var mouseLeave = function(d) {
      d3.selectAll(".Country")
        .transition()
        .duration(200)
        .style("opacity", .8)
      d3.select(this)
        .transition()
        .duration(200)
        .style("stroke", "#fff")
      d3.select("#tooltext").remove(); 
    }
    // Draw the map
    svg.append("g")
        .selectAll("path")
        .data(data.features)
        .enter().append("path")
            .attr("fill", "#69b3a2")
            .attr("d", d3.geoPath()
                .projection(projection)
            )
            .style("stroke", "#fff") //can fill the colors later
            .attr("class", function(d){ return "Country" } )
            .style("opacity", .8)
            .on("mouseover", mouseOver )
            .on("mouseleave", mouseLeave )
}