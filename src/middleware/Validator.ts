import { RequestHandler } from "express"
import schemas from "../schemas"
import { ValidationError, ValidationOptions } from "joi"

interface IError {
  field?: string
  message: string
}

interface validatorOpts {
  joiOptions?: ValidationOptions
  useFullError?: boolean
  wrapInArray?: boolean
}

/**
 *
 * @param path path to the schema exported from schemas
 * @param options Custom validation or change default configs of Joi ValidationOptions
 * @param cb use a custom funcion to return the errors object
 * @returns Request handler (middleware) for validating a predefined schema against input data
 */
const schemaValidator = (
  path: string,
  options: validatorOpts = { wrapInArray: true },
  cb?: (err: ValidationError) => IError[]
): RequestHandler => {
  const schema = schemas[path]

  if (!schema) {
    throw new Error(`Schema not found for path: ${path}`)
  }

  const joiOptions: ValidationOptions = options.joiOptions || {
    abortEarly: false
  }

  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, joiOptions)
    let errors: IError[] | { [key: string]: string } = {}
    if (error) {
      if (options.wrapInArray) {
        errors = cb
          ? cb(error)
          : error.details.map((err) => {
              return { field: err.context?.label, message: err.message }
            })
      }
      return res.status(422).send(errors)
    }
    // validation successful
    req.body = value
    return next()
  }
}

export default schemaValidator
