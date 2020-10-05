let { DataTypes, Model } = require("sequelize");

class FavoriteProduct extends Model {}

FavoriteProduct.initialize = sequelize => {
  return FavoriteProduct.init({
    id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      unique: true
    },
    customer_id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false
    },
    product_id: {
      type: DataTypes.STRING(36),
      allowNull: false
    }
  }, {
    sequelize,
    modelName: "FavoriteProduct",
    tableName: "favorite_product",
    freezeTableName: true,
    paranoid: false,
    timestamps: false
  });
}

FavoriteProduct.associate = models => {
  // @todo daniel
}

module.exports = FavoriteProduct;