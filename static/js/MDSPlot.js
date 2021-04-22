function mds_plot(myData, kmeans){
    d3.select("svg").remove();
    d3.select("table").remove();
    //console.log(myData)
    //console.log("kmeans", kmeans)
    totalArr = myData
    //console.log(myData)
    var xData = new Array(myData.length);
    var yData = new Array(myData.length);
    //var colorData = new Array(myData.length);
    
    //var totalArr = new Array(myData.length);
    for(var i=0;i<myData.length;i++){
        xData[i] = totalArr[i][0];
        yData[i] = totalArr[i][1];
    }
    //console.log(xData);
    //console.log(yData);

    //console.log(totalArr);
    var margin = { top: 50, right: 50, bottom: 70, left: 70 },
        width = 1000 - margin.left - margin.right,
        height = 625 - margin.top - margin.bottom;
    // append the svg object to the body of the page
    var svg = d3.select("#divX")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")")



    // Add X axis
    var x;
    x = d3.scaleLinear()
            .domain([0, 0])
            .range([0, width]);
    // if (xType == 'num') {
    //     x = d3.scaleLinear()
    //         .domain([0, 0])
    //         .range([0, width]);
    // } else if (xType == 'cat') {
    //     x = d3.scaleBand()
    //         .domain([0, 0])
    //         .range([0, width]);
    // }
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
        .attr("stroke", "black")
        .text("First Dimension");

    // Add Y axis
    var y;
    y = d3.scaleLinear()
            .domain(d3.extent(yData))
            .range([height, 0]);
    // if (yType == 'num') {
    //     y = d3.scaleLinear()
    //         .domain(d3.extent(yData))
    //         .range([height, 0]);
    // } else if (yType == 'cat') {
    //     y = d3.scaleBand()
    //         .domain(yData)
    //         .range([height, 0]);
    // }
    svg.append("g")
        .call(d3.axisLeft(y));
    
    //labelling y-axis
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x",0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .attr("stroke", "black")
        .text("Second Dimension");

    // Add dots
    svg.append('g')
        .selectAll("dot")
        .data(totalArr)
        .enter()
        .append("circle")
        .attr("cx", function (d) { return x(d[0]); })
        .attr("cy", function (d) { return y(d[1]); })
        .attr("r", 2)
        .style("fill", function (d, i) { 
            //console.log(kmeans[i]);
            return get_kcolor(kmeans[i]) } )

    // new X axis
    var xValue = function(d) { return d[0];}
    var yValue = function(d) { return d[1];}
    x.domain([d3.min(totalArr, xValue) - 1, d3.max(totalArr, xValue) + 1])
    y.domain([d3.min(totalArr, yValue) - 1, d3.max(totalArr, yValue) + 1])
    //xType == 'cat' ? x.domain(xData) : x.domain(d3.extent(xData));
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
        .style("fill", function (d, i) { 
            //console.log(kmeans[i]);
            return get_kcolor(kmeans[i]) } )
        //.style("fill","#69b3a2")
}