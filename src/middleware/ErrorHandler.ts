import { ErrorRequestHandler, NextFunction, Request, Response } from "express"

class CustomError extends Error {
  public statusCode: number
  constructor() {
    super()
    this.statusCode = 500
  }
}

export const errorHandler: ErrorRequestHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof CustomError) {
    res.status(err.statusCode)
  }

  return res.status(500).send({ message: err.message })

  next()
}
