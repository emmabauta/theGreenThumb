$(document).ready(function() {
  console.log('member.js loaded')

  
  
  let searchForm = $("form.search")
  let filterForm = $("form.filter")
  let filters = {
    growth_habit: ["Tree", "Forb/herb", "Vine", "Subshrub", "Graminoid", "Shrub"],
    active_growth_period: ["Spring", "Summer", "Year Round", "Fall", "Winter"],
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
    for (i in filters) {
      column = filters[i]
      header = humanize(i)

      grid = $(`<div col-md-2>`)
      title = $(`<h3>${header}:</h3>`)
      grid.append(title)
      for (index in column) {
        parameters = column[index]
        
        let newCheckbox = `<div class="checkbox"><label><input type="checkbox" name="type" value="${i}:${parameters}">${parameters}</label></div>`;

        grid.append(newCheckbox)
        
      }
      $("#filter").append(grid)
    }
  }

  filterForm.on("submit", function(e) {
    e.preventDefault()
    let filtering = []
    let categories =[
      {growth_habit: []},
      {active_growth_period: []},
      {flower_color: []},
      {foliage_color: []},
      {shade_tolerance: []},
      {bloom_period: []}
    ]
    
    $("input:checkbox[name=type]:checked").each(function(){
      filtering.push($(this).val());
    });

    for (i in filtering) {
      
      seperate = filtering[i]
      seperate = seperate.split(':')
      filterColumn = seperate[0]
      filterValue = seperate[1]

      for (index in categories) {
        
        if (filterColumn in categories[index]) {
          categories[index][filterColumn].push(filterValue)
        }
      }
    }
    $.ajax({
      url: "/api/filter",
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify(categories),
      success: function(result) {
        console.log("Post complete")

      }
    })
  })

  searchForm.on("submit", function(e) {
    e.preventDefault()
    let searchValue =  $("input#name-search").val().trim()
  $.get("/api/search/" + searchValue, function(data) {
    console.log(data);
    renderPlants(data)
  
  })
  })

  function humanize(str) {
    var i, frags = str.split('_');
    for (i=0; i<frags.length; i++) {
      frags[i] = frags[i].charAt(0).toUpperCase() + frags[i].slice(1);
    }
    return frags.join(' ');
  }

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
