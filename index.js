const isString = value => typeof value === 'string'

const guaranteedExpressive = error =>
  error.isExpressive ? error : InternalServerError(error)

const createError = (status = 500, message = '', response) => {
  let sended = false

  return {
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
    isSendAlready: function () { return sended },
    send: function (expressResponse = response, message) {
      if (message) this.message = message
      if (sended) return this
      if (!expressResponse) throw 'ExpressiveErrors needs an `express.Response` object to work properly.'
      expressResponse.status(status).send(this.message)
      sended = true
      return this
    },
    sendIf: function (condition = false, response, message) {
      if (condition) this.send(response, message)
      return this
    },
    sendUnless: function (condition = true, response, message) {
      if (!condition) this.send(response)
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
  }
}

const BadRequestError = (message, response) => createError(400, message, response)
const UnauthorizedError = (message, response) => createError(401, message, response)
const PaymentRequiredError = (message, response) => createError(402, message, response)
const ForbiddenError = (message, response) => createError(403, message, response)
const NotFoundError = (message, response) => createError(404, message, response)
const MethodNotAllowedError = (message, response) => createError(405, message, response)
const NotAcceptableError = (message, response) => createError(406, message, response)
const ProxyAuthenticationRequiredError = (message, response) => createError(407, message, response)
const RequestTimeoutError = (message, response) => createError(408, message, response)
const ConflictError = (message, response) => createError(409, message, response)
const GoneError = (message, response) => createError(410, message, response)
const LengthRequiredError = (message, response) => createError(411, message, response)
const PreconditionFailedError = (message, response) => createError(412, message, response)
const PayloadTooLargeError = (message, response) => createError(413, message, response)
const URITooLongError = (message, response) => createError(414, message, response)
const UnsupportedMediaTypeError = (message, response) => createError(415, message, response)
const RangeNotSatisfiableError = (message, response) => createError(416, message, response)
const ExpectationFailedError = (message, response) => createError(417, message, response)
const ImATeapotError = (message = "I'm a teapot", response) => createError(418, message, response)
const MisdirectedRequestError = (message, response) => createError(421, message, response)
const UnprocessableContentError = (message, response) => createError(422, message, response)
const LockedError = (message, response) => createError(423, message, response)
const FailedDependencyError = (message, response) => createError(424, message, response)
const TooEarlyError = (message, response) => createError(425, message, response)
const UpgradeRequiredError = (message, response) => createError(426, message, response)
const PreconditionRequiredError = (message, response) => createError(428, message, response)
const TooManyRequestsError = (message, response) => createError(429, message, response)
const RequestHeaderFieldsTooLargeError = (message, response) => createError(431, message, response)
const UnavailableForLegalReasonsError = (message, response) => createError(451, message, response)
const InternalServerError = (message, response) => createError(500, message, response)
const NotImplementedError = (message, response) => createError(501, message, response)
const BadGatewayError = (message, response) => createError(502, message, response)
const ServiceUnavailableError = (message, response) => createError(503, message, response)
const GatewayTimeoutError = (message, response) => createError(504, message, response)
const HTTPVersionNotSupportedError = (message, response) => createError(505, message, response)
const VariantAlsoNegotiatesError = (message, response) => createError(506, message, response)
const InsufficientStorageError = (message, response) => createError(507, message, response)
const LoopDetectedError = (message, response) => createError(508, message, response)
const NotExtendedError = (message, response) => createError(510, message, response)
const NetworkAuthenticationRequiredError = (message, response) => createError(511, message, response)

export {
  guaranteedExpressive,
  createError,
  BadRequestError,
  UnauthorizedError,
  PaymentRequiredError,
  ForbiddenError,
  NotFoundError,
  MethodNotAllowedError,
  NotAcceptableError,
  ProxyAuthenticationRequiredError,
  RequestTimeoutError,
  ConflictError,
  GoneError,
  LengthRequiredError,
  PreconditionFailedError,
  PayloadTooLargeError,
  URITooLongError,
  UnsupportedMediaTypeError,
  RangeNotSatisfiableError,
  ExpectationFailedError,
  ImATeapotError,
  MisdirectedRequestError,
  UnprocessableContentError,
  LockedError,
  FailedDependencyError,
  TooEarlyError,
  UpgradeRequiredError,
  PreconditionRequiredError,
  TooManyRequestsError,
  RequestHeaderFieldsTooLargeError,
  UnavailableForLegalReasonsError,
  InternalServerError,
  NotImplementedError,
  BadGatewayError,
  ServiceUnavailableError,
  GatewayTimeoutError,
  HTTPVersionNotSupportedError,
  VariantAlsoNegotiatesError,
  InsufficientStorageError,
  LoopDetectedError,
  NotExtendedError,
  NetworkAuthenticationRequiredError
}
