function scree_plot(data){
    //d3.select("svg").remove();
    d3.select("#divX").select("svg").remove();
    d3.select("table").remove();
    //console.log("json data" + data)
    //data = [73.0, 95.9, 99.60000000000001, 100.10000000000001]
    
    var totalArr = [];
    for(var i=0;i<data.length;i++){
        totalArr.push([i+1,data[i]]);
    }

    //console.log(totalArr[0])   
    //console.log("total Arr" , totalArr)
    // set the dimensions and margins of the graph
    var margin = {top: 50, right: 50, bottom: 50, left: 50},
        width = 500 - margin.left - margin.right,
        height = 350 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3.select("#divX")
    .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    
    // Add X axis --> it is a date format
    var x = d3.scaleLinear()
      .domain([0,totalArr.length + 1])
      .range([ 0, width ]);
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

    // Add Y axis
    var y = d3.scaleLinear()
    .domain([0,110])
    .range([ height, 0 ]);
    svg.append("g")
    .call(d3.axisLeft(y));

    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left/2)
      .attr("x",0 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .attr("stroke", "steelblue")
      .text("Eigen Values"); 


    svg.append("text")
      .attr("transform", "translate(" + (width/2) + " ," + (height + margin.top/2) + ")")
      .style("text-anchor", "end")
      .attr("stroke", "steelblue")
      .text("Dimensions");

    // Initialize line
    svg.append("path")
    .datum(totalArr)
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-width", 2)
    .attr("d", d3.line()
        .x(function(d) { 
        	//console.log(d);
        	return x(d[0]) })
        .y(function(d) { return y(d[1]) })
    )
   
    // Initialize dots 
    svg
    .selectAll('dot')
    .data(totalArr)
    .enter()
    .append('circle')
    .attr("cx", function(d) { return x(d[0]) })
    .attr("cy", function(d) { return y(d[1]) })
    .attr("r", 5)
    .style("fill", "#69b3a2")
    .on('mouseover', function(d){
        d3.select(this)
          .style('fill','red');
    })
    .on('mouseleave', function(d){
        d3.select(this)
          .style('fill','#69b3a2')
    })
    .on('click', function(d){
        d3.select("svg").remove();
        //scatter_matrix(d3.select(this).data()[0], kmeans);
    })

}