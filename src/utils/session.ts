import { Application } from "express"
import SequelizeSessionInit from "connect-session-sequelize"
import db from "../database/models"

/*eslint-disable-next-line*/
import Session from "../database/models/session.model"

import session from "express-session"
import { OS } from "./system"
import { IUserSession } from "../types/types"
import { ModelStatic } from "sequelize"

const SequelizeStore = SequelizeSessionInit(session.Store)

export default Session as ModelStatic<Session>
declare module "express-session" {
  export interface SessionData {
    user: IUserSession
  }
}

/**
 * @remarks initializes  sequelize store for session data {@link connect-session-sequelize}
 */
const store = new SequelizeStore({
  db: db,
  table: "Session",
  expiration: 24 * 60 * 60 * 1000,
  checkExpirationInterval: 15 * 60 * 1000,
  extendDefaultFields: function (defaults, session) {
    return {
      userId: session.user.id
    }
  }
})

/**
 * this merges express-session interface extending its type shape
 */

export function sessionInit(app: Application) {
  app.use(
    session({
      secret: OS.ENV.SECURITY.COOKIE_SECRET_KEY || "f34$10ACx16683sA@",
      cookie: {
        maxAge: 24 * 60 * 60 * 1000,
        secure: true,
        httpOnly: true,
        sameSite: "none"
      },
      saveUninitialized: false,
      store: store,
      resave: false,
      proxy: true
    })
  )
}
