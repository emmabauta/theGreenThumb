$(document).ready(function () {
  console.log('member.js loaded')

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


  function getPlants() {
  $.get("/api/user_data").then(function(data) {
    renderGarden(data);  
 
  });
}
  getPlants()


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

  $(document).on("click", "#lookup", function (e) {
    e.preventDefault()
    let filtering = []
    let categories = [
      { growth_habit: [] },
      { active_growth_period: [] },
      { flower_color: [] },
      { foliage_color: [] },
      { shade_tolerance: [] },
      { bloom_period: [] }
    ]

    $("input:checkbox[name=type]:checked").each(function () {
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
    let searchValue = $("input#name-search").val().trim()
    if (searchValue) {
      categories.push(searchValue)
    }
    $.ajax({
      url: "/api/filter",
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify(categories),
      success: function (result) {
        console.log("Post complete")
        renderPlants(result)

      }
    })
  })


  $(document).on("click", "#myGarden", function (e) {
    e.preventDefault();

    let addPlant = $(this).data("id")

    $.get("/api/id").then(function (data) {

      let newPlant = [
        { user: data.id },
        { toAdd: addPlant }
      ]
      $.ajax({
        url: "/api/newPlant",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(newPlant),
        success: function (result) {
          console.log("Post complete")

          getPlants()
          

        }
      })
    });


});


$(document).on("click","#delete",function(e) {
  e.preventDefault();

  let deletePlant = $(this).data("id")

  $.ajax({
    method: "DELETE",
    url: "/api/plants/" + deletePlant
  }).then(function(data) {
    console.log("Deleted");
    getPlants()


  })

    

});





  function humanize(str) {
    var i, frags = str.split('_');
    for (i = 0; i < frags.length; i++) {
      frags[i] = frags[i].charAt(0).toUpperCase() + frags[i].slice(1);
    }
    return frags.join(' ');
  }

  function renderPlants(data) {
    if (data.length !== 0) {



      $("#stats").empty();
      $("#stats").show();

      for (var i = 0; i < data.length; i++) {

        var div = $("<div>").attr("class", "bg-light", "text-dark");


        div.append("<h2> Common Name: " + data[i].common_name + "</h2>");
        div.append("<p> Scientific Name: " + data[i].scientific_name + "</p>");
        div.append(`<img src="${data[i].image_url}" width="250" height="300">`);
        // div.append("<p>" + data[i].State_and_Province + "</p>");
        div.append("<p> Growth Habit " + data[i].growth_habit + "</p>");
        // div.append("<p>" + data[i].Plant_Guides + "</p>");
        div.append("<p> Active Growth Period " + data[i].active_growth_period + "</p>");
        div.append("<p> Flower Color: " + data[i].flower_color + "</p>");
        div.append("<p> Foliage Color: " + data[i].foliage_color + "</p>");
        div.append("<p> Shade Tolerance: " + data[i].shade_tolerance + "</p>");
        div.append("<p> Bloom Period: " + data[i].bloom_period + "</p>");
        div.append(`<button type="button" data-id="${data[i].id}" id="myGarden" class="btn btn-default myGarden">Add to My Garden</button>`)
        // <i class="fas fa-plus-square"></i>

        $("#stats").append(div).append("<br>");
      }
      
    }
  }

  // In Process Need Fix Garden appending

  
// In Process Need Fix Garden appending

  // $(document).on("click", "#addBtn" , function(e) {
  //   e.preventDefault()
  //   console.log("THY BUTTON IS WORKING SIR!");
  // $.get("/api/search/", function(data) {
  //   console.log(data);
  //   renderGarden(data);
  
  // })
  // })


    })
  });

//GARDEN JQUERY
function renderGarden(data) {
  console.log(data);
  if (data.length !== 0) {
    $(".addItem").empty();
    $(".addItem").show();
    for (var i = 0; i < data.length; i++) {

      var div = $("<div>").attr("class", "col-md-4 border border-dark");
      
      div.append(`<img src="${data[i].image_url}" width="200" height="200">`);
      div.append(`<button type="button" data-id="${data[i].id}" id="myGarden" class="btn btn-dark myGarden">Delete</button>`);
      // div.append("<div>").attr("class","card mb-4 box-shadow");
      // div.append("<img>").attr("class", "card-img-top");
      // div.append("<div>").attr("class","card-body");
      // div.append("<p> User Selection").attr("class", "card-text");
      // div.append("<div>").attr("class", "d-flex justify-content-between align-items-center");
      // div.append(`<button type="button" data-id="${data[i].id}" id="myGarden" class="btn btn-primary myGarden">Delete</button>`);
      $(".addItem").append(div).append("<br>");
    }
  }
}

  renderFilters()

});
