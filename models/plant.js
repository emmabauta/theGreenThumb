// Creating our User model
module.exports = function(sequelize, DataTypes) {
  let Plant = sequelize.define("Plant", {
    // The email cannot be null, and must be a proper email before creation
    scientific_name: {
      type: DataTypes.TEXT,
      defaultValue: null,
    },
    Common_name: {
      type: DataTypes.TEXT,
      defaultValue: null,
    },
    State_and_Province: {
        type: DataTypes.TEXT,
        defaultValue: null,
    },
    Growth_Habit: {
        type: DataTypes.TEXT,
        defaultValue: null,
    },
    Plant_Guides: {
        type: DataTypes.TEXT,
        defaultValue: null,
    },
    Active_Growth_Period: {
        type: DataTypes.TEXT,
        defaultValue: null,
    },
    Flower_Color: {
        type: DataTypes.TEXT,
        defaultValue: null,
    },
    Foliage_Color: {
        type: DataTypes.TEXT,
        defaultValue: null,
    },
    Shade_Tolerance: {
        type: DataTypes.TEXT,
        defaultValue: null,
    },
    Bloom_Period: {
        type: DataTypes.TEXT,
        defaultValue: null,
    },
    image_url: {
        type: DataTypes.TEXT,
        defaultValue: null,
    },
    createdAt: {
        type: DataTypes.TEXT,
        defaultValue: null,
    },
    updatedAt: {
        type: DataTypes.TEXT,
        defaultValue: null,
    }

  }
  );
  return Plant;
};
