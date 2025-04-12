# expressive-errors
Let your errors to express themselves.

## Installation

```bash
npm install expressive-errors
```

## Usage

Are you not tired of writing yours Express controllers like this?
```javascript
const getBookById = async (req, res) => {
  try {
    const { id } = req.params
    const book = await service.getById(id)
    if (!book) return res.status(404).send({ error: 'Book not found' })
    res.send(book)
  }
  catch (error) {
    res.status(500).send({ error })
    console.error(error)
  }
}

```

With `expressive-errors` you can let the error to do the work for you:
```javascript
import { NotFoundError, InternalServerError } from 'expressive-errors'

const getBookById = async (req, res) => {
  try {
    const { id } = req.params
    const book = await service.getById(id)

    // Let the error to send itself
    if (!book) return NotFoundError({ error: 'Book not found' }).send(res)

    res.send(book)
  }
  catch (error) {
    // You can wrap any error to follow the flow
    const internalError = InternalServerError({ error }).send(res)
    // The error can stringify itself
    console.error(internalError.toString())
  }
}
```


```javascript
const getBookById = async (req, res) => {
  try {
    const { id } = req.params
    const book = await service.getById(id)

    // And why not let the error to throw itself?
    if (!book) NotFoundError({ error: 'Book not found' }).throw()

    res.send(book)
  }
  catch (error) {
    // ...and then you only have to manage the response in one single place
    if (error.isExpressive) return error.send(res)
    const internalError = InternalServerError({ error }).send(res)
    console.error(internalError.toString())
  }
}
```


```javascript
const getBookById = async (req, res) => {
  try {
    const { id } = req.params
    const book = await service.getById(id)

    // Even better, let the error to manage the flow control
    NotFoundError({ error: 'Book not found' })
      .throwUnless(book)
      .throwIf(book.author === 'Paulo Cohelo')

    res.send(book)
  }
  catch (error) {
    // Ensure every error is expressive
    const expressiveError = error.isExpressive ? error : InternalServerError({ error })
    // And let it express itself
    expressiveError
      .send(res)  // it can send itself
      .console()  // it can log directly to the console
      .console(logger.error) // ...or any other log of your choice
  }
}
```


```javascript
import { NotFoundError, guaranteedExpressive } from 'expressive-errors'

// Move the error obejct outside to simplify reading
const NOT_FOUND_ERROR = NotFoundError({ error: 'Book not found' })

const getBookById = async (req, res) => {
  try {
    const { id } = req.params
    const book = await service.getById(id)
    NOT_FOUND_ERROR.throwUnless(book)
    res.send(book)
  }
  catch (error) {
    // Guaranteed the error is expressive and then, send and log itself.
    guaranteedExpressive(error).send(res).console()
  }
}
```
### Errors availables

All of this are functions to generate a new error instance. You can pass as argument a message and an express response, or you can pass them latter.

`BadRequestError(message, response)`
`UnauthorizedError(message, response)`
`PaymentRequiredError(message, response)`
`ForbiddenError(message, response)`
`NotFoundError(message, response)`
`MethodNotAllowedError(message, response)`
`NotAcceptableError(message, response)`
`ProxyAuthenticationRequiredError(message, response)`
`RequestTimeoutError(message, response)`
`ConflictError(message, response)`
`GoneError(message, response)`
`LengthRequiredError(message, response)`
`PreconditionFailedError(message, response)`
`PayloadTooLargeError(message, response)`
`URITooLongError(message, response)`
`UnsupportedMediaTypeError(message, response)`
`RangeNotSatisfiableError(message, response)`
`ExpectationFailedError(message, response)`
`ImATeapotError(message, response)`
`MisdirectedRequestError(message, response)`
`UnprocessableContentError(message, response)`
`LockedError(message, response)`
`FailedDependencyError(message, response)`
`TooEarlyError(message, response)`
`UpgradeRequiredError(message, response)`
`PreconditionRequiredError(message, response)`
`TooManyRequestsError(message, response)`
`RequestHeaderFieldsTooLargeError(message, response)`
`UnavailableForLegalReasonsError(message, response)`
`InternalServerError(message, response)`
`NotImplementedError(message, response)`
`BadGatewayError(message, response)`
`ServiceUnavailableError(message, response)`
`GatewayTimeoutError(message, response)`
`HTTPVersionNotSupportedError(message, response)`
`VariantAlsoNegotiatesError(message, response)`
`InsufficientStorageError(message, response)`
`LoopDetectedError(message, response)`
`NotExtendedError(message, response)`
`NetworkAuthenticationRequiredError(message, response)`

If you want to create an error on your own you can use the `createError(status, message, response)` function.

Also if you are not sure the error you are catching is expressive you can evaluate the property `isExpressive` or you can use the `guaranteedExpressive(error)` function to get an `InternalErrorServer(error)` if the error was not an expressive error yet.

### Methods

- `status`: Has the HTTP status error code of the error. It is initialized by default depending of the method you use to create it.
- `message`: It's the payload of the error, usually an object or a string.
- `isExpressive`: Is a constant you can use to verify if an object is an expressive error.
- `toString()`: Returns a string representation of the error.
- `console(print, ...params)`: Print the error with `console.error` by default, but you can pass any log function of your choice instead. If your print functions needs other param than the message, just add it to the final.
- `send(response, message)`: Uses the express response (a.k.a. `res`) object to send itself. You can initialize the error object with the express response or you can wait to pass it as an argument to this function. Also you can pass the message in case you haven't initialized your error with it.
- `sendIf(conditon, response, message)`: Same as `send()` but you can add a boolean expression which needs to be true to send the response.
- `sendUnless(condition, response, message)`: Same as `sendIf()` but the condition must be false to send the response.
- `throw()`: Throws itself as an error. Beware to use this inside a `try/catch` block.
- `throwIf(condition)`: Pass a boolean expression as an argument to choose if when to throw the exception. This is a monad function so you can chain as many `throwIf()` as you want.
- `throwUnless(condition)`: Works like `throwIf()` but the boolean is evaluated as its opposite.

The `console()`, `send()`, `sendIf()`, `sendUnless()`, `throwIf()` and `throwUnless()` functions are monads so you can chain them as you want.
