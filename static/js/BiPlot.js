function biplot(data, vdata, featureNames){
    d3.select("svg").remove();
    d3.select("table").remove();
    console.log(data)
    console.log(data.points)
    data = data.points
    vdata = vdata.vectors
    console.log(vdata)
    console.log(featureNames.featureNames)
    featureNames = featureNames.featureNames
    //console.log("xData" + xData);
    //console.log("yData" + yData);
    // var totalArr = new Array(xData.length);
    // for(var i=0;i<xData.length;i++){
    //     totalArr[i] = [xData[i],yData[i]]; 
    // }
    
    //console.log(totalArr);
    var margin = { top: 50, right: 50, bottom: 70, left: 70 },
        width = 1000 - margin.left - margin.right,
        height = 1000 - margin.top - margin.bottom;
    // append the svg object to the body of the page
    var svg = d3.select("#divX")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")")



    // Add X axis
    x = d3.scaleLinear()
            .domain([0, 0])
            .range([0, width]);
    svg.append("g")
        .attr("class", "myXaxis")   // Note that here we give a class to the X axis, to be able to call it later and modify it
        .attr("transform", "translate(0," + height/4+ ")")
        .call(d3.axisBottom(x))
        .attr("opacity", "0")
        .attr("text-anchor", "end")
        .attr("stroke", "black")
        // .text("PC1")
    
    svg.select("g")
        .attr("class", "myXaxis")
        .append("text")
        .attr("transform", "translate(0," + (height/2 + margin.top/2 - 5) + ")")
        .attr("stroke", "steelblue")
        .text("PC1");

    //labelling for x axis
    // svg.append("text")
    //     .attr("transform",
    //         "translate(" + (width/2) + " ," + 
    //                        (height + margin.top - 5) + ")")
    //     .style("text-anchor", "middle")
    //     .text("xValue");

    // Add Y axis
    y = d3.scaleLinear()
            .domain([-1000,1000])
            .range([height/2, 0]);
    svg.append("g")
        .attr("transform", "translate(" + width/2 + ",0)")
        .call(d3.axisLeft(y))
        .attr("stroke", "black");
    
    //labelling y-axis
    svg.append("text")
        .attr("transform", "rotate(0)")
        .attr("y", -20)
        .attr("x",440)
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .attr("stroke", "steelblue")
        .text("PC2");

    // Add dots
    svg.append('g')
        .selectAll("dot")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", function (d) { return x(d[0]); })
        .attr("cy", function (d) { return y(d[1]); })
        .attr("r", 2)
        .style("fill", "#69b3a2")

    // new X axis
    var xValue = function(d) { return d[0];}
    x.domain([-(d3.max(data, xValue) + 1), d3.max(data, xValue) + 1]);
    svg.select(".myXaxis")
        .transition()
        .duration(200)
        .attr("opacity", "1")
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end");

    svg.selectAll("circle")
        .transition()
        .duration(2000)
        .attr("cx", function (d) { return x(d[0]); })
        .attr("cy", function (d) { return y(d[1]); })
        .style("fill","#69b3a2");
    
    svg.append('g')
        .selectAll('line')
        .data(vdata)
        .enter()
        .append('line')
        .style("stroke", "steelblue")
        .style("stroke-width", 3)
        .attr("x1", 0+width/2)
        .attr("y1", 0+height/4)
        .attr("x2", function(d){return x(2500*d[0])})
        .attr("y2", function(d){return y(2500*d[1])});
        
    svg.append('g')
        .selectAll('line')
        .data(vdata)
        .enter()
        .append('text')
        .attr("x", function(d){return x(2500*d[0])})
        .attr("y", function(d){return y(2500*d[1])})
        // .attr("transform", "rotate(-45)")
        .attr('text-anchor', 'start')
        .text(function(d,i){
            return featureNames[i]; 
        });

    
    //console.log(vdata);
    // svg.append('line')
    //     .style("stroke", "steelblue")
    //     .style("stroke-width", 5)
    //     .attr('x1', 0+width/2)
    //     .attr('y1', 0+height/4)
    //     .attr('x2', x(200))
    //     .attr('y2', y(200));
    
    
}