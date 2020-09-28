/**
 * Enumeration de Erros.
 *
 * @class ErrorEnum
 */
class ErrorEnum {

  /**
   * Cria uma instancia de ErrorEnum.
   *
   * @param {int} code
   * @memberof ErrorEnum
   */
  constructor(code, type) {
    this.code = code;
    this.type = type;
  }
}

ErrorEnum.INTERNAL = new ErrorEnum(1000, "internal");
ErrorEnum.UNAUTHORIZED = new ErrorEnum(1100, "unauthorized");
ErrorEnum.ILLEGAL_ARGUMENT = new ErrorEnum(1200, "illegal_argument");
ErrorEnum.COMMUNICATION = new ErrorEnum(1300, "communication");
ErrorEnum.INVALID = new ErrorEnum(1400, "invalid");
ErrorEnum.INVALID_PROPERTY = new ErrorEnum(1500, "invalid_property");
ErrorEnum.INVALID_PARAMETER = new ErrorEnum(1600, "invalid_parameter");
ErrorEnum.REQUEST_NOT_FOUND = new ErrorEnum(1700, "request_not_found");
ErrorEnum.CRITICAL = new ErrorEnum(1800, "critical");
ErrorEnum.DATABASE = new ErrorEnum(1900, "database")

module.exports = ErrorEnum;