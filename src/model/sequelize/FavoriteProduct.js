const { DataTypes, Model } = require("sequelize");

/**
 * Model de Produto Favorito.
 *
 * @class FavoriteProduct
 * @extends {Model}
 */
class FavoriteProduct extends Model {}

/**
 * Inicialização do Model.
 *
 * @static
 * @param {Sequelize} sequelize
 * @memberof FavoriteProduct
 */
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

/**
 * Associações do Model.
 *
 * @static
 * @param {<? extends Model>[]} models
 * @memberof FavoriteProduct
 */
FavoriteProduct.associate = models => {
  FavoriteProduct.belongsTo(models.Customer, {foreignKey: "customer_id"});
}

module.exports = FavoriteProduct;