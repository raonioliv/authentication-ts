import { NextFunction, Request, RequestHandler, Response } from "express"
// import { SessionData } from "express-session"

export const deserializeUser: RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.cookies || !req.cookies["sid"]) return next()
  req.sessionStore.get(req.cookies["sid"], function (err, sessionData) {
    if (err) return next(err)
    if (!sessionData) return next()

    req.user = sessionData.user

    return next()
  })
}
