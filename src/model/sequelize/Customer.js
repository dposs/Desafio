const { DataTypes, Model } = require("sequelize");

/**
 * Model de Consumidor.
 *
 * @class Customer
 * @extends {Model}
 */
class Customer extends Model {}

/**
 * Inicialização do Model.
 *
 * @static
 * @param {Sequelize} sequelize
 * @memberof Customer
 */
Customer.initialize = sequelize => {
  return Customer.init({
    id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      unique: true
    },
    name: {
      type: DataTypes.STRING(120),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(70),
      allowNull: false,
      unique: true
    }
  }, {
    sequelize,
    modelName: "Customer",
    tableName: "customer",
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
 * @memberof Customer
 */
Customer.associate = models => {
  // @todo daniel
}

module.exports = Customer;