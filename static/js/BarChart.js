function myBar(data) {
    console.log("finally its here")
    //d3.select("#div1").on('mousedown',null);
    //d3.select("svg").remove();
    d3.select("#div1").select("svg").remove();
    //console.log(bData);
    // const allGroup = bData.reduce(function (acc, curr) {
    //     acc[curr] ? acc[curr]++ : acc[curr] = 1;
    //     return acc;
    // }, {});
    // //console.log(allGroup);
    // xVal = Object.keys(allGroup);
    // yVal = Object.values(allGroup);

    // data = [{group: "python", 2020: "72", 2019: "67", 2018: "64"}, 
    //         {group: "Go", 2020: "68", 2019: "64", 2018: "64"}, 
    //         {group: "Swift", 2020: "65", 2019: "63", 2018: "61"},
    //         {group: "Go2", 2020: "68", 2019: "64", 2018: "64"}, 
    //         {group: "Swift2", 2020: "65", 2019: "63", 2018: "61"},
    //         {group: "JavaScript", 2020: "66", 2019: "66", 2018: "62"}]
    console.log(data[0]);
    data = data.slice(0,8);
  
    //data = data[0:8]
    // console.log(data[0].Nitrogen);
    //data
    a = ["United-States","Russia","Germany","France","United-Kingdom","China","Spain","Netherlands","Italy","Israel"]
    b = [12394,6148,1653,2162,1214,1131,814,1167,660,1263]
    c = [0,1,2,3,4,5,6,7,8,9]

    // var margin = { top: 50, right: 30, bottom: 90, left: 60 },
    //     width = 1200 - margin.left - margin.right,
    //     height = 625 - margin.top - margin.bottom;
    var margin = {top: 30, right: 30, bottom: 70, left: 60},
    width = 660 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3.select("#div1")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    // List of subgroups = header of the csv files = soil condition here
    var subgroups = ["2020", "2019"]
    //console.log(data[0])

    // List of groups = species here = value of the first column called group -> I show them on the X axis
    var groups = d3.map(data, function(d){return(d.group)}).keys()
    
    // X axis
    // var xScale = d3.scaleBand()
    //     .range([0, width])
    //     .padding(0.2);

    // var x = xScale
    //     .domain(a);
    // svg.append("g")
    //     .attr("transform", "translate(0," + height + ")")
    //     .transition().duration(1000)
    //     .call(d3.axisBottom(x))
    //     .selectAll("text")
    //     .attr("transform", "translate(-10,0)rotate(-45)")
    //     .style("text-anchor", "end");

    var x = d3.scaleBand()
      .domain(groups)
      .range([0, width])
      .padding([0.2])
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).tickSize(0));

    var yScale = d3.scaleLinear()
        .domain([0, 100])
        .range([height, 0]);

    // Add Y axis
    var y = yScale
        .range([height, 0]);
    svg.append("g")
        .transition().duration(1000)
        .call(d3.axisLeft(y));

    //labelling y-axis
    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x",0 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Percent of People"); 

    // Another scale for subgroup position?
    var xSubgroup = d3.scaleBand()
    .domain(subgroups)
    .range([0, x.bandwidth()])
    .padding([0.05])

    // color palette = one color per subgroup
    var color = d3.scaleOrdinal()
    .domain(subgroups)
    .range(['#440154ff','#377eb8'])



    // A function that change this tooltip when the user hover a point.
    // Its opacity is set to 1: we can now see it. Plus it set the text and position of tooltip depending on the datapoint (d)
    // var showTooltip = function (d) {
    //     d3.select(this)
    //         .style('fill', 'red')
    //         .append('text')
    //         .text("Fixation Duration")
    //         .html("text");

    //     var d = d3.select(this).data()[0];
    //     var xPos = x(d);
    //     var yPos = yScale(allGroup[d]) - 10;
    //     svg.append('g').append('text')
    //         .text(allGroup[d])
    //         .attr("id", "tooltext")
    //         .attr("stroke", "red")
    //         .attr("transform", function (d) { return "translate(" + xPos + "," + yPos + ")"; });
    // }
    // A function that change this tooltip when the leaves a point: just need to set opacity to 0 again
    // var hideTooltip = function (d) {
    //     d3.select(this)
    //         .style('fill', '#69b3a2')
    //     d3.select("#tooltext").remove();
    // }


    // update bars
    // svg.selectAll("rect")
    //     .data(c)
    //     .enter()
    //     .append("rect")
    //     .transition()
    //     .duration(1000)
    //     .attr("x", function (d) { return xScale(a[d]); })
    //     .attr("y", function (d) { return yScale(b[d]); })
    //     .attr("width", 10)
    //     .attr("height", function (d) { return height - yScale(b[d]); })
    //     .attr("fill", "#69b3a2")
        
    svg.append("g")
        .selectAll("g")
        // Enter in data = loop group per group
        .data(data)
        .enter()
        .append("g")
          .attr("transform", function(d) { return "translate(" + x(d.group) + ",0)"; })
        .selectAll("rect")
        .data(function(d) { return subgroups.map(function(key) { return {key: key, value: d[key]}; }); })
        .enter().append("rect")
          .attr("x", function(d) { return xSubgroup(d.key); })
          .attr("y", function(d) { return y(d.value); })
          .attr("width", xSubgroup.bandwidth())
          .attr("height", function(d) { return height - y(d.value); })
          .attr("fill", function(d) { return color(d.key); });
    

    // svg.selectAll('rect').on('mouseover', showTooltip)
    //     .on("mouseleave", hideTooltip)

    //legends
    var legend = svg.append('g')
                .attr('class', 'legend')
                .attr('transform', 'translate(' + (40 + 12) + ', 0)');

    legend.selectAll('rect')
        .data(subgroups)
        .enter()
        .append('rect')
        .attr('x', width - margin.left - margin.right)
        .attr('y', function(d, i){
            return i * 18;
        })
        .attr('width', 12)
        .attr('height', 12)
        .attr('fill', function(d, i){
            return color(i);
        });
            
    legend.selectAll('text')
        .data(subgroups)
        .enter()
        .append('text')
        .text(function(d){
            return d;
        })
        .attr('x', width - margin.left - margin.right + 18)
        .attr('y', function(d, i){
            return i * 18;
        })
        .attr('text-anchor', 'start')
        .attr('alignment-baseline', 'hanging');
}