/**
 * Enumeration de ORMs de DataSource.
 * 
 * @class DataSourceORMEnum
 */
class DataSourceORMEnum {
  
  /**
   * Cria uma instancia de DataSourceORMEnum.
   * 
   * @param {string} name 
   * @memberof DataSourceORMEnum
   */
  constructor(name) {
    Object.assign(this, {name});
  }
}

DataSourceORMEnum.SEQUELIZE = new DataSourceORMEnum("SEQUELIZE");

module.exports = DataSourceORMEnum;