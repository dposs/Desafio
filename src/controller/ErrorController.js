let AbstractError = require("../error/common/AbstractError");
let InternalError = require("../error/InternalError");
let UnauthorizedError = require("../error/UnauthorizedError");
let ErrorEnum = require("../enum/ErrorEnum");

/**
 * Controller de Erros.
 *
 * @class ErrorController
 */
class ErrorController {

  /**
   * Manipulador Global de Erros.
   *
   * @memberof ErrorController
   */
  handler() {
    return async (error, request, response, next) => {
      if (error instanceof UnauthorizedError) {
        response.set("WWW-Authenticate", "JWT");
      }

      if (!(error instanceof AbstractError)) {
        error = new InternalError().from(error);
      }

      console.error(error);

      delete error.json.data;
      delete error.data;

      return response
        .status(error.status)
        .json(error.json);
    };
  }
}

module.exports = ErrorController;