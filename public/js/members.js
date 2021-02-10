
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
    $.get("/api/user_data").then(function (data) {
      renderGarden(data);

    });
  }
  getPlants()

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
    window.location.reload();

  });


  $(document).on("click", "#delete", function (e) {
    e.preventDefault();

    let deletePlant = $(this).data("id")

    $.ajax({
      method: "DELETE",
      url: "/api/plants/" + deletePlant
    }).then(function (data) {
      console.log("Deleted");
      getPlants()


    })

    window.location.reload();

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
        div.append("<p> Growth Habit " + data[i].growth_habit + "</p>");
        div.append("<p> Active Growth Period " + data[i].active_growth_period + "</p>");
        div.append("<p> Flower Color: " + data[i].flower_color + "</p>");
        div.append("<p> Foliage Color: " + data[i].foliage_color + "</p>");
        div.append("<p> Shade Tolerance: " + data[i].shade_tolerance + "</p>");
        div.append("<p> Bloom Period: " + data[i].bloom_period + "</p>");
        div.append(`<button type="button" data-id="${data[i].id}" id="myGarden" class="btn btn-dark myGarden" >Add to My Garden</button>`)
        // <i class="fas fa-plus-square"></i>

        $("#stats").append(div).append("<br>");
      }

    }
  }

  //GARDEN JQUERY

  $(document).on("click", "#something", function (e) {
    e.preventDefault();
    let plantInfo= $(this).data("id")

   

    $.get("/api/modalData/"+ plantInfo).then(function (data) {
      renderModal(data)
      
    });
  });

  function renderGarden(data) {
    console.log(data);
    if (data.length !== 0) {
      $(".addItem").empty();
      $(".addItem").show();
      for (var i = 0; i < data.length; i++) {
        
        let target = `#examplemodal${data[i].id}`
        var div = $("<div>").attr("class", "col-md-4 ");

        div.append(`<img src="${data[i].image_url}" width="200" height="200">`);

        div.append(`<button type="button" data-id="${data[i].id}" class="btn btn-dark" id="something" data-bs-toggle="modal" data-bs-target="#examplemodal">Plant Info</button>`);
        div.append(`<button type="button" data-id="${data[i].id}" id="delete" class="btn btn-dark myGarden" style="float: right;">Delete</button>`);

        $(".addItem").append(div).append("<br>");
      }
    }
  }



  function renderModal(data){

    
    let div = $("body")
  
      console.log(data);
      let target = `exampleModal${data.id}`

      console.log();
      $(".modal-title").empty()
      $('.modal-body').empty()

      $(".modal-title").text(data.common_name)
   
      $('.modal-body').append(`<img src="${data.image_url}"  width=150 class="center"/>`);
      $('.modal-body').append(`<p> Growth Habit: ${data.growth_habit}</p>`);
      $('.modal-body').append(`<p> Active Growth Period: ${data.active_growth_period}</p>`);
      $('.modal-body').append(`<p> Flower Color: ${data.flower_color}</p>`);
      $('.modal-body').append(`<p> Foliage Color: ${data.foliage_color}</p>`);
      $('.modal-body').append(`<p> Shade Tolerance: ${data.shade_tolerance}</p>`);
      $('.modal-body').append(`<p> Bloom Period: ${data.bloom_period}</p>`);

      // let modal = $(`<div class="modal fade" id="${target}" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true"></div>`);
      // $('.fade').append(`<div id="mini" class="modal-dialog modal-dialog-centered"></div>`);
      // $('.fade').append(`<div class="modal-content"></div>`);
      // $('.fade').append(`<div class="modal-header"></div>`);
      // $('.fade').append(`<h5 class="modal-title" id="exampleModalLabel">${data.common_name}</h5>`);
      // $('.fade').append(`<div class="modal-body"></div>`);
      // $('.fade').append(`<img src="${data.image_url}"  width=150 class="center"/>`);
      // $('.fade').append(`<p> Growth Habit: ${data.growth_habit}</p>`);
      // $('.fade').append(`<p> Active Growth Period: ${data.active_growth_period}</p>`);
      // $('.fade').append(`<p> Flower Color: ${data.flower_color}</p>`);
      // $('.fade').append(`<p> Foliage Color: ${data.foliage_color}</p>`);
      // $('.fade').append(`<p> Shade Tolerance: ${data.shade_tolerance}</p>`);
      // $('.fade').append(`<p> Bloom Period: ${data.bloom_period}</p>`);
      // $('.fade').append(`<div class="modal-footer">`);
      // $('.fade').append(`<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>`);
    
      div.append(modal)

  }
  
  renderFilters()

});





// $('body').append(`<div class="modal fade" id="${target}" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true"></div>`);
// $('.fade').append(`<div id="mini" class="modal-dialog modal-dialog-centered"></div>`);
// $('.modal-dialog-centered').append(`<div class="modal-content"></div>`);
// $('.modal-content').append(`<div class="modal-header"></div>`);
// $('.modal-header').append(`<h5 class="modal-title" id="exampleModalLabel">${data[i].common_name}</h5>`);
// $('.modal-content').append(`<div class="modal-body"></div>`);
// $('.modal-body').append(`<img src="${data[i].image_url}"  width=150 class="center"/>`);
// $('.modal-body').append(`<p> Growth Habit: ${data[i].growth_habit}</p>`);
// $('.modal-body').append(`<p> Active Growth Period: ${data[i].active_growth_period}</p>`);
// $('.modal-body').append(`<p> Flower Color: ${data[i].flower_color}</p>`);
// $('.modal-body').append(`<p> Foliage Color: ${data[i].foliage_color}</p>`);
// $('.modal-body').append(`<p> Shade Tolerance: ${data[i].shade_tolerance}</p>`);
// $('.modal-body').append(`<p> Bloom Period: ${data[i].bloom_period}</p>`);
// $('.modal-content').append(`<div class="modal-footer">`);
// $('.modal-footer').