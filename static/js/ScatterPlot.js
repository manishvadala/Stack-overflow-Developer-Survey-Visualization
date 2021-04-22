function myScatter() {
    xType='num'
    yType='num'
    xValue='xLabel'
    yValue='yLabel'
    //console.log("xData" + xData);
    //console.log("yData" + yData);
    d3.select("#div4").select("svg").remove();
    // var totalArr = new Array(xData.length);
    // for(var i=0;i<xData.length;i++){
    //     totalArr[i] = [xData[i],yData[i]]; 
    // }
    
    //Data
    a = [1,22,33,43,59,79,102,120,150,200]
    b = [1,2,3,4,5,5,4,3,2,1]
    c = [0,1,2,3,4,5,6,7,8,9]

    //console.log(totalArr);
    var margin = { top: 20, right: 20, bottom: 30, left: 30 },
        width = 400 - margin.left - margin.right,
        height = 250 - margin.top - margin.bottom;
    // append the svg object to the body of the page
    var svg = d3.select("#div4")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")")



    // Add X axis
    var x;
    if (xType == 'num') {
        x = d3.scaleLinear()
            .domain([0, 0])
            .range([0, width]);
    } else if (xType == 'cat') {
        x = d3.scaleBand()
            .domain([0, 0])
            .range([0, width]);
    }
    svg.append("g")
        .attr("class", "myXaxis")   // Note that here we give a class to the X axis, to be able to call it later and modify it
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
        .attr("opacity", "0")

    //labelling for x axis
    svg.append("text")
        .attr("transform",
            "translate(" + (width/2) + " ," + 
                           (height + margin.top - 5) + ")")
        .style("text-anchor", "middle")
        .text(xValue);

    // Add Y axis
    var y;
    if (yType == 'num') {
        y = d3.scaleLinear()
            .domain(d3.extent(b))
            .range([height, 0]);
    } else if (yType == 'cat') {
        y = d3.scaleBand()
            .domain(yData)
            .range([height, 0]);
    }
    svg.append("g")
        .call(d3.axisLeft(y));
    
    //labelling y-axis
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x",0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text(yValue);

    // Add dots
    svg.append('g')
        .selectAll("dot")
        .data(c)
        .enter()
        .append("circle")
        .attr("cx", function (d) { return x(a[d]); })
        .attr("cy", function (d) { return y(b[d]); })
        .attr("r", 2)
        .style("fill", "#69b3a2")

    // new X axis
    xType == 'cat' ? x.domain(xData) : x.domain(d3.extent(a));
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
        .attr("cx", function (d) { return x(a[d]); })
        .attr("cy", function (d) { return y(b[d]); })
        .style("fill","#69b3a2")

}