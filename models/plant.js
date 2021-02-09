// Creating our User model
module.exports = function(sequelize, DataTypes) {
  let Plant = sequelize.define("Plant", {
    // The email cannot be null, and must be a proper email before creation
    scientific_name: {
      type: DataTypes.TEXT,
      defaultValue: null,
    },
    common_name: {
      type: DataTypes.TEXT,
      defaultValue: null,
    },
    state_and_province: {
        type: DataTypes.TEXT,
        defaultValue: null,
    },
    growth_habit: {
        type: DataTypes.TEXT,
        defaultValue: null,
    },
    plant_guides: {
        type: DataTypes.TEXT,
        defaultValue: null,
    },
    active_growth_period: {
        type: DataTypes.TEXT,
        defaultValue: null,
    },
    flower_color: {
        type: DataTypes.TEXT,
        defaultValue: null,
    },
    foliage_color: {
        type: DataTypes.TEXT,
        defaultValue: null,
    },
    shade_tolerance: {
        type: DataTypes.TEXT,
        defaultValue: null,
    },
    bloom_period: {
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

  Plant.associate = function(models) {
    models.Plant.belongsToMany(models.User, { through: models.UserPlant, onDelete: "cascade" });
  }
  return Plant;
};
