import { ModelStatic } from "sequelize"
import Session from "../database/models/session.model"

import Crypt from "../utils/crypt"
import { IUserSession } from "../types/types"
import { resp } from "../utils/resp"
import { Request } from "express"

class SessionService {
  private model: ModelStatic<Session> = Session
  private crypt: typeof Crypt = Crypt

  async createSession(req: Request, sessionData: IUserSession) {
    try {
      const session = await this.model.create({ ...sessionData })

      return resp(200, session)
    } catch (error) {
      return resp(500, error)
    }
  }
}

export default SessionService
