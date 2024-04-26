import { NextFunction, Request, RequestHandler, Response } from "express"

export class Auth {
  public authenticate: RequestHandler = (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    if (!this.isLoggedIn(req))
      return res.status(401).send({ message: "Not authenticated." })

    next()
  }

  private isLoggedIn = (req: Request): boolean => {
    return !!req.user //boolean for user session
  }
}
