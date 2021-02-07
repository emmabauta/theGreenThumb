$(document).ready(function() {
  console.log('member.js loaded')

  
  
  let searchForm = $("form.search")
  let filters = {
    growth_habit: ["Tree", "Forb/herb", "Vine", "Subshrub", "Graminoid", "Shrub"],
    growth_period: ["Spring", "Summer", "Year Round", "Fall", "Winter"],
    flower_color: ["Blue", "Brown", "Green", "Orange", "Purple", "Red", "White", "Yellow"],
    foliage_color: ["Green", "Dark Green", "Gray-Green", "Red", "White-Gray", "Yellow-Green"],
    shade_tolerance: ["Intermediate", "Intolerant", "Tolerant"],
    bloom_period: ["Early Spring", "Mid Spring", "Late Spring", "Spring", "Early Summer", "Mid Summer", "Late Summer", "Summer", "Fall", "Winter", "Late Winter", "Indeterminate"]
  }
  // This file just does a GET request to figure out which user is logged in
  // and updates the HTML on the page
  $.get("/api/user_data").then(function(data) {
    $(".member-name").text(data.email);
  });

  function renderFilters() {
    console.log("Heloo worllllddd")

    for (i in filters) {
      grid = $('<div col-md-2>')

      column = filters[i]
      for (index in column) {
        parameters = column[index]
        console.log(parameters)
        let newCheckbox = `<div class="checkbox"><label><input type="checkbox" value="${parameters}">${parameters}</label></div>`;

        grid.append(newCheckbox)
        
      }
      $("#filter").append(grid)
      
    }
    
  }

  searchForm.on("submit", function(e) {
    e.preventDefault()
    let searchValue =  $("input#name-search").val().trim()
  $.get("/api/search/" + searchValue, function(data) {
    console.log(data);
    renderPlants(data)
  
  })
  })

  function renderPlants(data) {
    if (data.length !== 0) {
  
      $("#stats").empty();
      $("#stats").show();
  
      for (var i = 0; i < data.length; i++) {
        var div = $("<div>");
  
        div.append("<h2>" + data[i].scientific_name + "</h2>");   
        div.append("<p>" + data[i].Common_name + "</p>");   
        div.append(`<img src="${data[i].image_url}" width="300" height="350">`);   
        $("#stats").append(div);
      }
    }
  }

  
  renderFilters()



});
