// Requiring our models and passport as we've configured it
let db = require("../models");
let passport = require("../config/passport");
const { Sequelize } = require('sequelize');
const { QueryTypes } = require('sequelize');
const userPlant = require("../models/userPlant");


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

  // Route for getting some data about our user to be used client side
  app.get("/api/user_data", function(req, res) {
    if (!req.user) {
      // The user is not logged in, send back an empty object
      res.json({});
    } else {

      db.UserPlant.findAll({
      where: {
        UserId: req.user.id
      }

    }).then((data) => {
      res.json(data);
    })
  }
      // Otherwise send back the user's email and id
      // Sending back a password, even a hashed password, isn't a good idea
    //   res.json({
    //     email: req.user.email,
    //     id: req.user.id
    //   });
    // }
  });

  // app.post("/api/mygarden", function(req, res) {
  //   console.log(req.body);
    
  // })


  app.post("/api/newPlant", function(req, res) {
    addPlant = req.body
    let user;
    let plant;
    console.log(addPlant);
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
    console.log(typeof plant);

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
    // myQuery = myQuery.replace(/\s*$/,"")
    
    myQuery += ';'

    db.sequelize.query(myQuery, { type: QueryTypes.SELECT }).then((data) => {
      res.json(data)
    })
  })


  function createQuery(filters) {
    let query = 'SELECT * FROM green_thumb.plants WHERE ';

    if (searchedName) {
      query += `(MATCH (common_name) AGAINST ("${searchedName}")) AND `;
    }
    if (filters){
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
