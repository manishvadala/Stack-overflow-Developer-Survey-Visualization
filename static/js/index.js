var isHist = false;
var kmeans = [];
var geoData = [];
var selected_val_bar = "LanguageWorkedWith";
var global_country = "All";
var global_year = 2020;
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
    .attr("value", function(d) {return d;});

    d3.select("#selectVar")
    .on('change',function(){
      selected_val_bar = d3.select(this).property('value')
      display_BarChart(selected_val_bar);
    });

    atrData = ["Avg. Salaries", "Avg. Age","Avg. Work Experience", "Avg. WorkWeekHrs"]
    atrData2 = ["ConvertedComp", "Age", "YearsCodePro", "WorkWeekHrs"]
    d3.select("#selectAtr")
    .selectAll('myOptions')
    .data(atrData)
    .enter()
    .append('option')
    .text(function(d) {return d;})
    .attr("value", function(d) {return d;})

    d3.select("#selectAtr")
    .on('change',function(){
      selected_val = d3.select(this).property('value')
      display_myMap(atrData2[atrData.indexOf(selected_val)]);
    });

    yData = ["2019", "2020"]
    d3.select("#selectYear")
    .selectAll('myOptions')
    .data(yData)
    .enter()
    .append('option')
    .text(function(d) {return d;})
    .attr("value", function(d) {return d;})

    d3.select("#selectYear")
    .on('change',function(){
      global_year = parseInt(d3.select(this).property('value'));
      display_ScatterPlot();
      display_PCPlot();
    });

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

    
}

function update_Filters_Country(filter_country){
    console.log("filter country ", filter_country);
    global_country = filter_country
    display_BarChart(selected_val_bar);
    display_ScatterPlot();
    display_PCPlot();
}


function display_BarChart(FilterString){
//FilterString="LanguageWorkedWith";
  if(global_country === "All"){
    data = JSON.stringify({
      "_display":FilterString,
      "_filters":{}
    })
  }
  else{
    data = JSON.stringify({
      "_display":FilterString,
      "_filters":{"Country": global_country}
    })
  }
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
  if(global_country === "All"){
    data = JSON.stringify({
      "_filters":["YearsCodePro","ConvertedComp","LanguageWorkedWith"],
      "year":global_year
    })
  }
  else{
    data = JSON.stringify({
      "_filters":["YearsCodePro","ConvertedComp","LanguageWorkedWith"],
      "Country":global_country,
      "year":global_year
    })
  }
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
  if(global_country === "All"){
    data = JSON.stringify({
      "_filters":["YearsCodePro", "ConvertedComp", "WorkWeekHrs", "JobSat"],
      "year":global_year
    })
  }
  else{
    data = JSON.stringify({
      "_filters":["YearsCodePro", "ConvertedComp", "WorkWeekHrs", "JobSat"],
      "Country":global_country,
      "year":global_year
    })
  }
  var settings = {
    "async": true,
    "crossDomain": true,
    "url": "/pcpplot",
    "method": "POST",
    "headers": {
      "content-type": "application/json",
      "cache-control": "no-cache",
      "postman-token": "ee0d7b6a-d48f-7cf6-bc27-110ea60f1ac3"
    },
    "processData": false,
    "data": data
  }
  
  $.ajax(settings).done(function (response) {
    console.log(response);
    parallel_coordinates_plot(data, response.pcp_data);
  });
  //parallel_coordinates_plot();
}

function display_myMap(FilterString){
  data = JSON.stringify({
    "_display":FilterString
  })
  var settings = {
    "async": true,
    "crossDomain": true,
    "url": "/worldmap",
    "method": "POST",
    "headers": {
      "content-type": "application/json",
      "cache-control": "no-cache",
      "postman-token": "1890a726-8ad9-a4b7-7689-fde3ea7a9ec9"
    },
    "processData": false,
    "data": data
  }
  
  $.ajax(settings).done(function (response) {
    console.log(response);
    myMap(geoData, response.avg_data);
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
  geoData = JSON.parse(text);
  console.log(geoData);
  console.log("testing coming here");
  display_BarChart(selected_val_bar);
  display_ScatterPlot();
  display_PCPlot();
  display_myMap("ConvertedComp");
  get_filters();
});
//get_kmeans();

//display_ScreePlot();