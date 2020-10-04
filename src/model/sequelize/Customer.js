let { DataTypes, Model } = require("sequelize");

class Customer extends Model {}

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
    freezeTableName: true,
    paranoid: false,
    timestamps: false
  });
}

Customer.associate = models => {

}

module.exports = Customer;