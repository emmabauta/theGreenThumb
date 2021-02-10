// Requiring our models and passport as we've configured it
let db = require("../models");
let passport = require("../config/passport");
const { Sequelize } = require('sequelize');
const { QueryTypes } = require('sequelize');




module.exports = function(app) {
  // Using the passport.authenticate middleware with our local strategy.
  // If the user has valid login credentials, send them to the members page.
  // Otherwise the user will be sent an error
  let searchedName;

  app.post("/api/login", passport.authenticate("local"), function(req, res) {
    res.json(req.user);
  });

  // Route for signing up a user. The user's password is automatically hashed and stored securely thanks to
  // how we configured our Sequelize User Model. If the user is created successfully, proceed to log the user in,
  // otherwise send back an error
  app.post("/api/signup", function(req, res) {
    db.User.create({
      email: req.body.email,
      password: req.body.password
    })
      .then(function() {
        res.redirect(307, "/api/login");
      })
      .catch(function(err) {
        res.status(401).json(err);
      });
  });

  // Route for logging user out
  app.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/");
  });


  app.get("/api/user_data", function(req, res) {
    if (!req.user) {
      res.json({});
    } else {

      db.UserPlant.findAll({
      where: {
        UserId: req.user.id
      }

    }).then((data) => {
      let query = `SELECT * FROM green_thumb.plants WHERE `;
      for (i in data) {
        let newPlants = data[i].dataValues.PlantId;
        if (data[i] == data[data.length -1]) {
              query += `id = ${newPlants};`
              db.sequelize.query(query, { type: QueryTypes.SELECT }).then((results) => {
                // console.log(results);
                res.json(results)
              })
            }
            query += `id = ${newPlants} OR `
      }

    })
  }
});

  app.get("/api/id", function(req, res) {
    if (!req.user) {

      res.json({});
    } else {
      res.json({
        id: req.user.id
      });
    }
  })

  app.post("/api/getplants", function(req,res) {
    let query = 'SELECT * FROM green_thumb.plants WHERE ';
    plants = req.body
    plants = parseInt(plants)
    for (i in plants) {
      if (plants[i] == plants[plants.length -1]) {
        query += `(id = "${plants[i]}");`
        db.sequelize.query(query, { type: QueryTypes.SELECT }).then((data) => {
          res.json(data)
        })
      }
      query += `(id = "${plants[i]}") AND `
    }
  })

  app.post("/api/newPlant", function(req, res) {
    addPlant = req.body
    let user;
    let plant;

    for (i in addPlant) {
      for (index in addPlant[i]) {
        if (addPlant[i] == addPlant[0]) {
          user = addPlant[i][index]
        }
        else {
          plant = addPlant[i][index]
        }
      }
    }
 
    realPlant =parseInt(plant)


    db.User.findOne({
      where: {
        id: user
      }
    }).then((data) => {
      data.addPlant(realPlant)
    })
  })


  app.post("/api/filter", function(req, res) {

    filters = req.body

    searchedName = filters[filters.length -1]
    filters.splice(filters.length -1, 1)
    toDelete = []
    
    
    for (i in filters) {
      for (index in filters[i]) {
        if (filters[i][index].length < 1) {
          toDelete.push(i)
        }
      }
    }

    toDelete.sort((a, b) => b - a)

    for (i in toDelete) {

      filters.splice(toDelete[i], 1)
    }
    myQuery = createQuery(filters)
    myQuery = myQuery.replace(/\s*$/,"")
    
    myQuery += ';'

    db.sequelize.query(myQuery, { type: QueryTypes.SELECT }).then((data) => {
      res.json(data)
    })
  })

  app.delete("/api/plants/:id", function(req, res) {
    db.UserPlant.destroy({
      where: {
        PlantId: req.params.id
      }
    }).then((result) => {
        res.json(result)
    })
  });

  app.get("/api/modalData/:id", function(req,res) {
    plants = req.params.id
    let query = `SELECT * FROM green_thumb.plants WHERE (id = "${plants}");`;
    db.sequelize.query(query, { type: QueryTypes.SELECT }).then((data) => {


      // res.json(data)
      console.log(JSON.stringify(data[0]) + data[0].scientific_name);

      // result = JSON.stringify(data[0])

      res.json(data[0])
 
      // for (i in data) {
      //   console.log("hello world");
        
      //   let moreinfo = bootbox.dialog({
      //     title: data[i].common_name,
      //     message: `<img src="${data[i].image_url}"  width=150 class="center"/><p> Growth Habit: ${data[i].growth_habit}</p><p> Active Growth Period: ${data[i].active_growth_period}</p><p> Flower Color: ${data[i].flower_color}</p><p> Foliage Color: ${data[i].foliage_color}</p><p> Shade Tolerance: ${data[i].shade_tolerance}</p><p> Bloom Period: ${data[i].bloom_period}</p>`,
      //     size: 'large',
      //     buttons: {
      //         cancel: {
      //             label: "I'm a cancel button!",
      //             className: 'btn-danger',
      //             callback: function(){
      //                 console.log('Custom cancel clicked');
      //             }
      //         },
      //         noclose: {
      //             label: "I don't close the modal!",
      //             className: 'btn-warning',
      //             callback: function(){
      //                 console.log('Custom button clicked');
      //                 return false;
      //             }
      //         },
      //         ok: {
      //             label: "I'm an OK button!",
      //             className: 'btn-info',
      //             callback: function(){
      //                 console.log('Custom OK clicked');
      //             }
      //         }
      //     }
      // });
  
    })
  });



  function createQuery(filters) {
    let query = 'SELECT * FROM green_thumb.plants WHERE ';

    if (typeof searchedName !== '') {
      query += `(MATCH (common_name) AGAINST ("${searchedName}")) `;
    }
    if (filters.length > 0){
      if (searchedName) {
        query += 'AND '
      }
      for (let index = 0; index < filters.length; index++) {
        myObj = filters[index]
        for (key in myObj) {

          valueArray = myObj[key]

          for (value in valueArray) {
            if (valueArray[value] == valueArray[0]) {
              query += '('
            }
            if ((valueArray[value] == valueArray[valueArray.length - 1]) && (myObj == filters[filters.length - 1])) {
              query += `${key} = "${valueArray[value]}")`;
              return query;
            }
            else {
              
              if (valueArray[value] == valueArray[valueArray.length - 1]) {
                query += `${key} = "${valueArray[value]}") `;
                query += 'AND ';
              }
              else {
                query += `${key} = "${valueArray[value]}" `;
                query += 'OR ';
              }
              
            }

          }
        }
      }
    }
    else {
      return query;
    }

  }

};
