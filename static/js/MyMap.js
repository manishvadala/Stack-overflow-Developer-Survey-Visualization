function myMap(data, attrData){
    // The svg
    d3.select("#div2").select("svg").remove();
    console.log(data);
    console.log(attrData);
    var Switch = 1;
    var cFilter = "All";
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
    //attrData = {"United States":1232, "India":3212}
    console.log(attrData);
    console.log(Object.values(attrData));
    

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

    //colors
    a = d3.min(Object.values(attrData));
    b = d3.max(Object.values(attrData));
    k = (b-a)/4
    var colorScale = d3.scaleThreshold()
      .domain([a-k, a, a+k, a+2*k, a+3*k, a+4*k])
      .range(d3.schemeBlues[7]);

    // Map and projection
    var projection = d3.geoNaturalEarth()
    .scale(width / 1.3 / Math.PI)
    .translate([width / 2, height / 2])

    var tip = d3.tip()
                .attr('class', 'd3-tip')
                .offset([100, 0])
                .html(function(d) {
                  var dataRow = Math.floor(attrData[d.properties.name])
                    if (!isNaN(dataRow)) {
                        //console.log(dataRow);
                        return dataRow;
                    }
                })
    svg.call(tip);

    var mouseOver = function(d) {
        tip.show(d, this),
        d3.selectAll(".Country")
        .transition()
        .duration(200)
        .style("opacity", .5)
        //console.log("this value",d.properties.name);
        d3.select(this)
        .transition()
        .duration(200)
        .style("opacity", .8)
        .style("stroke", "white")
    }

    var mouseLeave = function(d) {
      tip.hide(d, this),
      d3.selectAll(".Country")
        .transition()
        .duration(200)
        .style("opacity", .8)
      d3.select(this)
        .transition()
        .duration(200)
        .style("stroke", "#fff")
    }

    var mouseDown = function(d){
      d3.selectAll(".Country")
      .transition()
      .duration(200)
      .style("opacity", .5)
      //console.log("this value",d.properties.name);
      if(Switch){
        d3.select(this)
          .transition()
          .duration(200)
          .style("opacity", .8)
          .attr("fill", function(d){
            //d.total = 500000000;
            if(!isNaN(Math.floor(attrData[d.properties.name]))){
              cFilter = d.properties.name;
              return "red";
            }
            else return colorScale(0);
          })
          Switch = 0;
          update_Filters_Country(cFilter);
      }
      else{
        d3.select(this)
          .transition()
          .duration(200)
          .style("opacity", .8)
          .attr("fill", function(d){
            //d.total = 500000000;
            if(!isNaN(Math.floor(attrData[d.properties.name])))
              return colorScale(attrData[d.properties.name]);
            else return colorScale(0);
          })
          Switch = 1;
          cFilter = "All"
          update_Filters_Country(cFilter);
      }

    }
    // Draw the map
    svg.append("g")
        .selectAll("path")
        .data(data.features)
        .enter().append("path")
            //.attr("fill", "#69b3a2")
            .attr("fill", function(d){
              //d.total = 500000000;
              if(!isNaN(Math.floor(attrData[d.properties.name])))
                return colorScale(attrData[d.properties.name]);
              else return colorScale(0);
            })
            .attr("d", d3.geoPath()
                .projection(projection)
            )
            .style("stroke", "#fff") //can fill the colors later
            .attr("class", function(d){ return "Country" } )
            .style("opacity", .8)
            .on("mouseover", mouseOver)
            .on("mouseleave", mouseLeave)
            .on("mousedown", mouseDown)
}