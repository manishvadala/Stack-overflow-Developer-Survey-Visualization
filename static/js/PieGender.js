function showGender(res_data){
    d3.select("#div5").select("svg").remove();

    // set the dimensions and margins of the graph
    var width = 350
    height = 430
    margin = 40

    // The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
    var radius = Math.min(width, height) / 2 - margin

    // append the svg object to the div called 'my_dataviz'
    var svg = d3.select("#div5")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    // create 2 data_set
    console.log("resdata==>",res_data)
    var data1 = {Male:res_data["Man"], Female: res_data["Woman"], Others:res_data["Other"]}

    var subgroups = ["Male", "Female", "Others"]
    
    // set the color scale
    var color = d3.scaleOrdinal()
    .domain(["d", "Others", "a", "b", "Female", "Male", "c"])
    .range(d3.schemeBlues[7]);

    // A function that create / update the plot for a given variable:
    function update(data) {
        // Compute the position of each group on the pie:
        var pie = d3.pie()
        .value(function(d) {return d.value; })
        .sort(function(a, b) { console.log(a) ; return d3.ascending(a.key, b.key);} ) // This make sure that group order remains the same in the pie chart
        var data_ready = pie(d3.entries(data))
    
        // map to data
        var u = svg.selectAll("path")
        .data(data_ready)
    
        // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
        u
        .enter()
        .append('path')
        .merge(u)
        .transition()
        .duration(1000)
        .attr('d', d3.arc()
            .innerRadius(0)
            .outerRadius(radius)
        )
        .attr('fill', function(d){ return(color(d.data.key)) })
        .attr("stroke", "white")
        .style("stroke-width", "2px")
        .style("opacity", 1)
    
        // remove the group that is not present anymore
        u
        .exit()
        .remove();

        //legends
        var legend = svg.append('g')
                    .attr('class', 'legend')
                    .attr('transform', 'translate(-150, 100)');

        legend.selectAll('rect')
            .data(subgroups)
            .enter()
            .append('rect')
            .attr('x', -20)
            .attr('y', function(d, i){
                return i * 18;
            })
            .attr('width', 12)
            .attr('height', 12)
            .attr('fill', function(d, i){
                return color(d);
            });

        legend.selectAll('text')
            .data(subgroups)
            .enter()
            .append('text')
            .text(function(d){
                return d;
            })
            .attr('x', 0)
            .attr('y', function(d, i){
                return i * 18;
            })
            .attr('text-anchor', 'start')
            .attr('alignment-baseline', 'hanging');
    
    }

    // Initialize the plot with the first dataset
    update(data1)
}