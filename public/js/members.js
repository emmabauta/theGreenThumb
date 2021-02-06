$(document).ready(function() {
  console.log('member.js loaded')

  
  
  let searchForm = $("form.search")

  // This file just does a GET request to figure out which user is logged in
  // and updates the HTML on the page
  $.get("/api/user_data").then(function(data) {
    $(".member-name").text(data.email);
  });


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
});
