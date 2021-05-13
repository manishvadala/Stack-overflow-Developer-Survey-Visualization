function myScatter(data) {
    console.log("entering scatter");
    xType='num'
    yType='num'
    xValue='Experience in Years'
    yValue='Compensation'
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

    // data = [{groupA: "8", groupB: "72000", groupC: "Python", groupD: "100"}, 
    //         {groupA: "7", groupB: "68000", groupC: "Go", groupD: "200"}, 
    //         {groupA: "7", groupB: "65650", groupC: "Swift", groupD: "250"},
    //         {groupA: "6", groupB: "68780", groupC: "Go2", groupD: "300"}, 
    //         {groupA: "5", groupB: "65000", groupC: "Swift2", groupD: "200"},
    //         {groupA: "1", groupB: "66000", groupC: "JavaScript", groupD: "250"}];

    console.log(data);
    console.log(data[0].groupA);

    //console.log(totalArr);
    var margin = { top: 40, right: 60, bottom: 50, left: 70 },
        width = 700 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;
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
            .rangeRound([0, width]).padding(0.1);
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
                           (height + margin.top) + ")")
        .style("text-anchor", "middle")
        .text(xValue);

    // Add Y axis
    var y;
    if (yType == 'num') {
        a = d3.min(data, function(d) { return d.groupB; })
        b = d3.max(data, function(d) { return d.groupB; })
        k = (b-a)/10
        y = d3.scaleLinear()
            //.domain([40000, d3.max(data, function(d) { return d.groupB; })])
            .domain([a-k, b+k])
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

    // Adding color
    var myColor = d3.scaleOrdinal()
    .domain(d3.extent(data, function(d) { return d.groupC; }))
    .range(d3.schemeSet2);

    // Add a scale for bubble size
    var z = d3.scaleLinear()
    .domain(d3.extent(data, function(d) { return d.groupD; }))
    .range([ 4, 20]);

    var tip = d3.tip()
                .attr('class', 'd3-tip')
                .offset([100, 0])
                .html(function(d) {
                    return d.groupC + ": " + d.groupD;
                //   var dataRow = Math.floor(attrData[d.properties.name])
                //     if (!isNaN(dataRow)) {
                //         console.log(dataRow);
                //         return dataRow;
                //     }
                })
    svg.call(tip);

    // Add dots
    svg.append('g')
        .selectAll("dot")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", function (d) { return x(d.groupA); })
        .attr("cy", function (d) { return y(d.groupB); })
        .attr("r", function (d) { return z(d.groupD); })
        .style("fill", function (d) { return myColor(d.groupC); })
        .on("mouseover", tip.show)
        .on("mouseleave", tip.hide)

    // new X axis
    a = d3.min(data, function(d) { return d.groupA; })
    b = d3.max(data, function(d) { return d.groupA; })
    k = (b-a)/10
    xType == 'cat' ? x.domain(data.map(function(d) { return d.groupA; })) : x.domain([a-k,b+k]);
    svg.select(".myXaxis")
        .transition()
        .duration(200)
        .attr("opacity", "1")
        .call(d3.axisBottom(x));
        // .selectAll("text")
        // .attr("transform", "translate(-10,0)rotate(-45)")
        // .style("text-anchor", "end");

    svg.selectAll("circle")
        .transition()
        .duration(2000)
        .attr("cx", function (d) { return x(d.groupA); })
        .attr("cy", function (d) { return y(d.groupB); })
        // .style("fill","#69b3a2")

}
