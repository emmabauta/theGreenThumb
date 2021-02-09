// Creating our User model
module.exports = function(sequelize, DataTypes) {
    let UserPlant = sequelize.define("UserPlant", {
      // The email cannot be null, and must be a proper email before creation

    })
    return UserPlant;
  };
  