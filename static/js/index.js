var isHist = false;
var kmeans = [];
function init(){
    d3.selectAll("svg").remove();
}

function make_active(event){
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    event.currentTarget.className += " active";

}
// rect_plot();
// document.getElementById("div1").style.display="block";
// document.getElementById("selectVar").style.display="block";
// document.getElementById("div2").style.display="none";

function get_filters(){

    tData = ["LanguageWorkedWith", "DatabaseWorkedWith"]
    d3.select("#selectVar")
    .selectAll('myOptions')
    .data(tData)
    .enter()
    .append('option')
    .text(function(d) {return d;})
    .attr("value", function(d) {return d;})

    yData = ["2019", "2020"]
    d3.select("#selectYear")
    .selectAll('myOptions')
    .data(yData)
    .enter()
    .append('option')
    .text(function(d) {return d;})
    .attr("value", function(d) {return d;})

    aData = ["Experience", "Avg Work Hours"]
    d3.select("#selectA")
    .selectAll('myOptions')
    .data(aData)
    .enter()
    .append('option')
    .text(function(d) {return d;})
    .attr("value", function(d) {return d;})

    bData = ["Salaries"]
    d3.select("#selectB")
    .selectAll('myOptions')
    .data(bData)
    .enter()
    .append('option')
    .text(function(d) {return d;})
    .attr("value", function(d) {return d;})

    cData = ["LanguageWorkedWith", "DatabaseWorkedWith"]
    d3.select("#selectC")
    .selectAll('myOptions')
    .data(cData)
    .enter()
    .append('option')
    .text(function(d) {return d;})
    .attr("value", function(d) {return d;})

    dData = ["No. of People"]
    d3.select("#selectD")
    .selectAll('myOptions')
    .data(dData)
    .enter()
    .append('option')
    .text(function(d) {return d;})
    .attr("value", function(d) {return d;})

    atrData = ["Avg. Salaries", "Avg. Age"]
    d3.select("#selectAtr")
    .selectAll('myOptions')
    .data(atrData)
    .enter()
    .append('option')
    .text(function(d) {return d;})
    .attr("value", function(d) {return d;})
}
function display_biplot(event){
    make_active(this.event);
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": "/biplot",
        "method": "GET",
        "headers": {
          "cache-control": "no-cache",
          "postman-token": "af4ad609-59ba-150e-e3f4-7924baad5236"
        }
    }
      
    $.ajax(settings).done(function (response) {
        console.log(response[1]);
        //var xys = JSON.parse(response[1]);
        biplot(response[2], response[1], response[0]);
    });
}

function display_ScreePlot(){
    //make_active(this.event)
    console.log("FDJKFHDAKF")
    //scree_plot(data);
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": "/scree",
        "method": "GET",
        "headers": {
          "cache-control": "no-cache",
          "postman-token": "809a1b89-e81c-b145-a397-add6d88d970d"
        }
    }
    
    $.ajax(settings).done(function (response) {
        console.log(response);
        var obj = JSON.parse(response.eigen_values);
        //var obj2 = JSON.parse(kmeans);
        //scree_plot(obj, obj2);
        scree_plot(obj);
    });
     
}

function display_BarChart(){
  FilterString="LanguageWorkedWith";
  data = JSON.stringify({
    "_display":FilterString,
    "_filters":{}
  })
  var settings = {
    "async": true,
    "crossDomain": true,
    "url": "/barchart",
    "method": "POST",
    "headers": {
      "content-type": "application/json",
      "cache-control": "no-cache",
      "postman-token": "2e0d766d-0264-5f92-b8e1-8387dce55a67"
    },
    "processData": false,
    "data": data
  }
  
  $.ajax(settings).done(function (response) {
    console.log(response);
    //var obj = JSON.parse(response.bc_data)
    myBar(response.bc_data);
  });
}

function display_ScatterPlot(){
  data = JSON.stringify({
    "_filters":["YearsCodePro","ConvertedComp","LanguageWorkedWith"]
  })
  var settings = {
    "async": true,
    "crossDomain": true,
    "url": "/scatterplot",
    "method": "POST",
    "headers": {
      "content-type": "application/json",
      "cache-control": "no-cache",
      "postman-token": "cbaf7d49-3346-ea15-0144-bbff894474f7"
    },
    "processData": false,
    "data": data
  }
  
  $.ajax(settings).done(function (response) {
    console.log(response);
    myScatter(response.data);
  });
}

function display_PCPlot(){
  parallel_coordinates_plot();
}

function display_mdsplot(event){
    make_active(this.event)
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": "/mdsplot",
        "method": "GET",
        "headers": {
          "cache-control": "no-cache",
          "postman-token": "87d14ae2-a44d-53e1-d724-5ecbef03c9df"
        }
      }
      
      $.ajax(settings).done(function (response) {
        //console.log(response);
        //console.log(response.Values);
        var obj = JSON.parse(response.Values);
        var obj2 = JSON.parse(kmeans)
        mds_plot(obj, obj2);
      });
}

function display_pcplot(event){
    make_active(this.event)
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": "/pcplot",
        "method": "GET",
        "headers": {
          "cache-control": "no-cache",
          "postman-token": "56decab4-c9b3-cc3f-a8bc-84ad563f1163"
        }
      }
      
      $.ajax(settings).done(function (response) {
        console.log(response);
        // var obj = JSON.parse(response[0].featureNames);
        // var obj2 = JSON.parse(response[1].values);
        var obj2 = JSON.parse(kmeans)
        parallel_coordinates_plot(response[0].featureNames, response[1].values, obj2)
      });

}

function get_kmeans(){
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": "/kmeans",
        "method": "GET",
        "headers": {
          "cache-control": "no-cache",
          "postman-token": "65e1da46-ddb1-9d42-023b-781886552bb8"
        }
      }
      
      $.ajax(settings).done(function (response) {
        console.log(response);
        kmeans = response.kmeansLabels;
      });
}
function get_kcolor(x){
    colorList = ["#440154ff", "#21908dff", "#fde725ff", "#F8766D", "pink", "gold", "slateblue", "grey"]
    return colorList[x];
}

function readTextFile(file, callback) {
  var rawFile = new XMLHttpRequest();
  rawFile.overrideMimeType("application/json");
  rawFile.open("GET", file, true);
  rawFile.onreadystatechange = function() {
      if (rawFile.readyState === 4 && rawFile.status == "200") {
          callback(rawFile.responseText);
      }
  }
  rawFile.send(null);
}

//usage:
readTextFile("../static/geo.json", function(text){
  var data = JSON.parse(text);
  console.log(data);
  myMap(data);
});
//get_kmeans();
console.log("testing coming here")
display_BarChart();
display_ScatterPlot();
display_PCPlot();
get_filters();
//display_ScreePlot();
