function scatter_matrix(d, kmeans){
    d3.select("svg").remove();
    console.log(d);
    var data
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": "/scatter/" + d[0],
        "method": "GET",
        "headers": {
          "cache-control": "no-cache",
          "postman-token": "4fd1a61f-7da0-5570-7d27-10529515c6c3"
        }
      }
      
      $.ajax(settings).done(function (response) {
        console.log(response);
        console.log(response.scatter_data);
        plot_scatter(response.scatter_data, kmeans, response.pca_loadings);
      });

      //console.log("data is " , data)
}

function plot_scatter(data, kmeans, pca_loadings){
    d3.select("svg").remove();
    d3.select("table").remove();
    console.log("scatter data", data);
    var width = 960,
        size = 230,
        padding = 20;

    var x = d3.scaleLinear()
        .range([padding / 2, size - padding / 2]);

    var y = d3.scaleLinear()
        .range([size - padding / 2, padding / 2]);

    var xAxis = d3.axisBottom()
        .scale(x)
        .ticks(6);

    var yAxis = d3.axisLeft()
        .scale(y)
        .ticks(6);

    var color = d3.scaleOrdinal(d3.schemeCategory10);

    var domainByTrait = {},
        traits = d3.keys(data[0]).filter(function(d) { return d !== "species"; }),
        n = traits.length;
    //console.log("features i guess ", domainByTrait);
    traits.forEach(function(trait) {
        domainByTrait[trait] = d3.extent(data, function(d) { return d[trait]; });
    });
    //console.log("features i guess ", traits);
    xAxis.tickSize(size * n);
    yAxis.tickSize(-size * n);

    var brush = d3.brush()
        .on("start", brushstart)
        .on("brush", brushmove)
        .on("end", brushend)
        .extent([[0,0],[size,size]]);

    var svg = d3.select("#divX").append("svg")
        .attr("width", size * n + padding)
        .attr("height", size * n + padding)
        .append("g")
        .attr("transform", "translate(" + padding + "," + padding / 2 + ")");

    svg.selectAll(".x.axis")
        .data(traits)
        .enter().append("g")
        .attr("class", "x axis2")
        .attr("transform", function(d, i) { return "translate(" + (n - i - 1) * size + ",0)"; })
        .each(function(d) { x.domain(domainByTrait[d]); d3.select(this).call(xAxis); });

    svg.selectAll(".y.axis")
        .data(traits)
        .enter().append("g")
        .attr("class", "y axis2")
        .attr("transform", function(d, i) { return "translate(0," + i * size + ")"; })
        .each(function(d) { y.domain(domainByTrait[d]); d3.select(this).call(yAxis); });

    var cell = svg.selectAll(".cell")
        .data(cross(traits, traits))
        .enter().append("g")
        .attr("class", "cell")
        .attr("transform", function(d) { return "translate(" + (n - d.i - 1) * size + "," + d.j * size + ")"; })
        .each(plot);

    // Titles for the diagonal.
    cell.filter(function(d) { return d.i === d.j; }).append("text")
        .attr("x", padding)
        .attr("y", padding)
        .attr("dy", ".71em")
        .text(function(d) { return d.x; });

    cell.call(brush);

    function plot(p) {
        var cell = d3.select(this);

        x.domain(domainByTrait[p.x]);
        y.domain(domainByTrait[p.y]);

        cell.append("rect")
            .attr("class", "frame")
            .attr("x", padding / 2)
            .attr("y", padding / 2)
            .attr("width", size - padding)
            .attr("height", size - padding);

        cell.selectAll("circle")
            .data(data)
        .enter().append("circle")
            .attr("cx", function(d) { return x(d[p.x]); })
            .attr("cy", function(d) { return y(d[p.y]); })
            .attr("r", 4)
            .style("fill", function (d, i) { return get_kcolor(kmeans[i]) } );
    }

    var brushCell;

    // Clear the previously-active brush, if any.
    function brushstart(p) {
        if (brushCell !== this) {
        d3.select(brushCell).call(brush.move, null);
        brushCell = this;
        x.domain(domainByTrait[p.x]);
        y.domain(domainByTrait[p.y]);
        }
    }

    // Highlight the selected circles.
    function brushmove(p) {
        var e = d3.brushSelection(this);
        svg.selectAll("circle").classed("hidden", function(d) {
        return !e
            ? false
            : (
            e[0][0] > x(+d[p.x]) || x(+d[p.x]) > e[1][0]
            || e[0][1] > y(+d[p.y]) || y(+d[p.y]) > e[1][1]
            );
        });
    }

    // If the brush is empty, select all circles.
    function brushend() {
        var e = d3.brushSelection(this);
        if (e === null) svg.selectAll(".hidden").classed("hidden", false);
    }

    function cross(a, b) {
    var c = [], n = a.length, m = b.length, i, j;
    for (i = -1; ++i < n;) for (j = -1; ++j < m;) c.push({x: a[i], i: i, y: b[j], j: j});
    return c;
    }

    function tabulate(data, columns) {
        var table = d3.select("#divX").append("table")
                .attr("style", "margin-top: 4%", "margin-left: 4%"),
            thead = table.append("thead"),
            tbody = table.append("tbody");
    
        // append the header row
        thead.append("tr")
            .selectAll("th")
            .data(columns)
            .enter()
            .append("th")
                .text(function(column) { return column; });
    
        // create a row for each object in the data
        var rows = tbody.selectAll("tr")
            .data(data)
            .enter()
            .append("tr");
        
        for (var i = 0; i < data.length; i++) {
            data[i].unshift(traits[i]);
        }
        // create a cell in each row for each column
        var cells = rows.selectAll("td")
            .data(function(row) {
                return columns.map(function(column, i) {
                    return { column: column, value: row[i] };
                });
            })
            .enter()
            .append("td")
            .text(function(d) { return d.value; });
        
        return table;
    }
    console.log("pca_loadings", pca_loadings);
    console.log("length ", pca_loadings[0].length);
    pcColumns = new Array(pca_loadings[0].length + 1);
    pcColumns[0] = "Attribute";
    for(var i = 0; i< pca_loadings[0].length; i++){
        pcColumns[i+1] = "PC" + (i+1);
        //console.log(pcColumns[i]);
    }
    tabulate(pca_loadings, pcColumns);


}