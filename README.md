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
import { NotFoundError, InternalServerError } from 'expressive-errors'

// Move the error obejct outside to simplify reading
const ERROR = NotFoundError({ error: 'Book not found' })

const getBookById = async (req, res) => {
  try {
    const { id } = req.params
    const book = await service.getById(id)
    ERROR
      .throwUnless(book)
      .throwIf(book.author === 'Paulo Cohelo')
    res.send(book)
  }
  catch (error) {
    const expressiveError = error.isExpressive ? error : InternalServerError({ error })
    expressiveError.send(res).console()
  }
}
```
### Errors availables

All of this are functions to generate a new error instance. You can pass as argument a message and an express response, or you can pass them latter.

`BadRequestError()`,
`UnauthorizedError()`,
`ForbiddenError()`,
`NotFoundError()`,
`MethodNotAllowedError()`,
`ImATeapotError()`,
`ConflictError()`,
`UnprocessableEntityError()`,
`TooManyRequestsError()`,
`InternalServerError()`,
`NotImplementedError()`,
`BadGatewayError()`,
`ServiceUnavailableError()`,
`GatewayTimeoutError()`,


If you want to create an error on your own you can use the `createError()` function which accepts an status code, a message and an express response.

### Methods

- `status`: Has the HTTP status error code of the error. It is initialized by default depending of the method you use to create it.
- `message`: It's the payload of the error, usually an object or a string.
- `isExpressive`: Is a constant you can use to verify if an object is an expressive error.
- `toString`: Returns a string representation of the error.
- `console`: Print the error in the console, but you can pass any log function of your choice instead.
- `send`: Uses the express response (a.k.a. `res`) object to send itself. You can initialize the error object with the express response or you can wait to pass it as an argument to this function.
- `throw`: Throws itself as an error. Beware to use this inside a `try/catch` block.
- `throwIf`: Pass a boolean expression as an argument to choose if when to throw the exception. This is a monad function so you can chain as many `throwIf` as you want.
- `throwUnless`: Works like `throwIf` but the boolean is evaluated as its opposite.

The `console`, `send`, `throwIf` and `throwUnless` functions are monads so you can chain them as you want.
