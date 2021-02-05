// Creating our User model
module.exports = function(sequelize, DataTypes) {
  let User = sequelize.define("User", {
    // The email cannot be null, and must be a proper email before creation
    scientific_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Common_name: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    State_and_Province: {
        type: DataTypes.TEXT,
    },
    Growth_Habit: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    Plant_Guides: {
        type: DataTypes.TEXT,
    },
    Active_Growth_Period: {
        type: DataTypes.TEXT,
    },
    Flower_Color: {
        type: DataTypes.TEXT,
    },
    Foliage_Color: {
        type: DataTypes.TEXT,
    },
    Shade_Tolerance: {
        type: DataTypes.TEXT,
    },
    Bloom_Period: {
        type: DataTypes.TEXT,
    },
    image_url: {
        type: DataTypes.TEXT,
        allowNull: false,
    }

  });
  return User;
};
