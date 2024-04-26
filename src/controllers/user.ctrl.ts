import { type NextFunction, type Request, type Response } from "express"
import UserService from "../services/user.service"
import emailHelper from "../helpers/emailHelper"
export class UserControllers {
  private service = new UserService()
  /**
   * Create a user
   * @statusCode 
      - 201: Registration success: user created
      - 409: Registration failure: conflict data in DB
      - 500: DB operation failed
  */

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const [status, user] = await this.service.create(req.body)
      if (user) {
        emailHelper.sendAccountCreatedEmail(user)
      }
      res.status(status).send(user)
    } catch (error) {
      next(error)
    }
  }
  /**
   * To do: better aproach for initializing user session 
   * Implement redis store for sessions
   * @statusCode 
      - 200: Authentication success: User loggedIn 
      - 401: Login failure: user couldn't login 
      - 404: Login failure: no users found for the provided login info

    @returns
      - cookied sid 
   */

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const [status, data, msg] = await this.service.login(
        req.body.username,
        req.body.password
      )

      if (!data) {
        return res.status(status).send(msg)
      }

      await req.sessionStore.get(req.cookies["sid"], function (err, session) {
        if (!session) {
          req.sessionStore.createSession(req, {
            cookie: req.session.cookie,
            user: {
              email: data.user.email,
              firstName: data.user.firstName,
              lastName: data.user.lastName,
              id: data.user.id
            }
          })
          res.cookie("sid", req.sessionID, {
            maxAge: 30 * 24 * 60 * 60 * 1000,
            secure: true,
            sameSite: "none",
            httpOnly: true
          })
        }
      })

      return res.status(200).send("Ok")
    } catch (error) {
      next(error)
    }
  }

  /**
   * destroys session and sesison data in DB and expires session cookie for client
   * @statusCode
   * - 200: successfully disconected
   */
  async logout(req: Request, res: Response) {
    req.session.destroy(req.cookies["sid"])
    req.sessionStore.destroy(req.cookies["sid"])
    res.cookie("sid", "", { expires: new Date(0) })
    res.status(200).send("successfully disconected")
  }

  async confirmAccountCreation(
    req: Request,
    res: Response
    // next: NextFunction
  ) {
    const { token } = req.query
    const [status, user, message] = await this.service.confirmAccountCreation(
      token as string
    )

    if (!user) return res.status(status).send(message)

    req.sessionStore.createSession(req, {
      cookie: req.session.cookie,
      user: {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        id: user.id
      }
    })
    res.status(200).send("Logged in successfully")
  }

  async accountRecovery(req: Request, res: Response) {
    const [status, user, message] = await this.service.get(req.body.email)

    if (!user) return res.status(status).send(message)
    emailHelper.sendAccountRecoveryEmail(user)
    res.status(status).send("Email sent for password recovery.")
  }
}
