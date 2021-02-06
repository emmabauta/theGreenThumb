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
      for (let i in data.length) {
        console.log(data[i].image_url)
      }
    })
    })

});
