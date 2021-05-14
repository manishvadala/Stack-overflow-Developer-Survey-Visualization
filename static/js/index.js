var isHist = false;
var kmeans = [];
var geoData = [];
var selected_val_bar = "LanguageWorkedWith";
var selected_val_map = "Avg. Salaries";
var selected_val_sColor = "LanguageWorkedWith";
var global_country = "All";
var global_year = 2020;
var global_gender="";
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

function get_filters(){
    tData = ["LanguageWorkedWith", "DatabaseWorkedWith", "PlatformWorkedWith", "LanguageDesireNextYear", "DatabaseDesireNextYear", "PlatformDesireNextYear", "DevType"]
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
      selected_val_sColor = selected_val_bar;
      display_BarChart(selected_val_bar);
      display_ScatterPlot();
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
      selected_val_map = d3.select(this).property('value')
      display_myMap(atrData2[atrData.indexOf(selected_val_map)]);
    });

    yData = ["2020", "2019"]
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
      global_country = "All";
      display_BarChart(selected_val_bar);
      display_myMap(atrData2[atrData.indexOf(selected_val_map)]);
      display_ScatterPlot();
      display_PCPlot();
    });
   
}

function update_Filters_Country(filter_country){
    console.log("filter country ", filter_country);
    global_country = filter_country;
    display_BarChart(selected_val_bar);
    display_ScatterPlot();
    display_PCPlot();
    display_gender();
}

function update_Filters_Gender(filter_gender){
    global_gender = filter_gender;
    display_ScatterPlot();
    display_PCPlot();
}


function display_BarChart(FilterString){
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
    myBar(response.bc_data);
  });
}

function display_ScatterPlot(){
  if(global_country === "All"){
    data = JSON.stringify({
      "_filters":["YearsCodePro","ConvertedComp",selected_val_sColor],
      "Country":"",
      "year":global_year,
      "Gender":global_gender
    })
  }
  else{
    data = JSON.stringify({
      "_filters":["YearsCodePro","ConvertedComp",selected_val_sColor],
      "Country":global_country,
      "year":global_year,
      "Gender":global_gender
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
    myScatter(response.data_clubbed);
  });
}

function display_PCPlot(){
  if(global_country === "All"){
    data = JSON.stringify({
      "_filters":["YearsCodePro", "EdLevel", "ConvertedComp", "JobSeek", "WorkWeekHrs", "JobSat"],
      "year":global_year,
      "Gender":global_gender
    })
  }
  else{
    data = JSON.stringify({
      "_filters":["YearsCodePro", "EdLevel", "ConvertedComp", "JobSeek", "WorkWeekHrs", "JobSat"],
      "Country":global_country,
      "year":global_year,
      "Gender":global_gender
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
    parallel_coordinates_plot(data, response.pcp_data);
  });
}

function display_myMap(FilterString){
  data = JSON.stringify({
    "_display":FilterString,
    "year": global_year
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
    myMap(geoData, response.avg_data);
  });  
}

function display_gender(){
    if(global_country!=='All')
      data = JSON.stringify({"Country":global_country});
    else{
      data = JSON.stringify({});
    }
  var settings = {
    "url": "/piechart",
    "method": "POST",
    "timeout": 0,
    "headers": {
      "Content-Type": "application/json"
    },
    "data": data
  };
  
  $.ajax(settings).done(function (response) {
    showGender(response.data);
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

readTextFile("../static/geo.json", function(text){
  geoData = JSON.parse(text);
  console.log(geoData);
  console.log("testing coming here");
  display_BarChart(selected_val_bar);
  display_ScatterPlot();
  display_PCPlot();
  display_myMap("ConvertedComp");
  display_gender();
  get_filters();
});