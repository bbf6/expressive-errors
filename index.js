const isString = value => typeof value === 'string'

const createError = (status = 500, message = '', response) => ({
  status,
  message,
  isExpressive: true,
  toString: function () {
    const stringMessage = isString(this.message)
      ? this.message
      : JSON.stringify(this.message)
    return `Error ${this.status}: ${stringMessage}`
  },
  console: function (print = console.error, params = []) {
    print(this.toString(), ...params)
    return this
  },
  send: function (expressResponse = response) {
    expressResponse.status(status).send(message)
    return this
  },
  throw: function () {
    throw this
  },
  throwIf: function (condition) {
    if (condition) throw this
    return this
  },
  throwUnless: function (condition) {
    if (!condition) throw this
    return this
  }
})

const BadRequestError = (message, response) =>
  createError(400, message, response)

const UnauthorizedError = (message, response) =>
  createError(401, message, response)

const ForbiddenError = (message, response) =>
  createError(403, message, response)

const NotFoundError = (message, response) =>
  createError(404, message, response)

const MethodNotAllowedError = (message, response) =>
  createError(405, message, response)

const ImATeapotError = (message = "I'm a teapot", response) =>
  createError(418, message, response)

const ConflictError = (message, response) =>
  createError(409, message, response)

const UnprocessableEntityError = (message, response) =>
  createError(422, message, response)

const TooManyRequestsError = (message, response) =>
  createError(429, message, response)

const InternalServerError = (message, response) =>
  createError(500, message, response)

const NotImplementedError = (message, response) =>
  createError(501, message, response)

const BadGatewayError = (message, response) =>
  createError(502, message, response)

const ServiceUnavailableError = (message, response) =>
  createError(503, message, response)

const GatewayTimeoutError = (message, response) =>
  createError(504, message, response)

export {
  createError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  MethodNotAllowedError,
  ImATeapotError,
  ConflictError,
  UnprocessableEntityError,
  TooManyRequestsError,
  InternalServerError,
  NotImplementedError,
  BadGatewayError,
  ServiceUnavailableError,
  GatewayTimeoutError
}
