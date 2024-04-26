import { ModelStatic, Op } from "sequelize"
import User from "../database/models/user.model"
import IUser from "../types/user"
import { resp } from "../utils/resp"
import Crypt from "../utils/crypt"

import { IUserSession } from "../types/types"
// import { omit } from "lodash"
class UserService {
  private model: ModelStatic<User> = User
  private crypt: typeof Crypt = Crypt

  async get(param: string | number) {
    const user = await this.model.findOne({
      where: {
        [Op.or]: [{ email: param }, { id: param }, { cpf: param }]
      }
    })

    if (!user) return resp(200, null, "No user found")

    return resp(200, user)
  }

  async login(username: string, password: string) {
    let accessToken: string
    // let refreshToken: string
    const user = await this.model.scope("withPassword").findOne({
      where: {
        [Op.or]: [{ email: username }, { cpf: username }]
      }
    })

    if (!user) {
      return resp(404, null, "Invalid credentials.")
    }

    const match = await this.crypt.compareHash(password, user.password)

    if (match) {
      // refreshToken = this.crypt.encodeJWT({ email: user.id }, "30d")
      accessToken = this.crypt.encodeJWT({ email: user.id }, "10s")
      return resp(200, { user, accessToken })
    }

    return resp(401, null, "Invalid credentials")
  }
  async create(user: IUser) {
    try {
      const userExists = await this.model.findOne({
        where: {
          [Op.or]: [{ email: user.email }]
        }
      })
      if (userExists) return resp(409, null, "User already registered.")

      const { id } = await this.model.create({ ...user })
      const userData = await this.model.findByPk(id)

      return resp(201, userData)
    } catch (error) {
      return resp(500, null, "Something went wrong")
    }
  }
  async confirmAccountCreation(token: string) {
    try {
      const decoded = this.crypt.verifyJWT<IUserSession>(token)

      const user = await this.model.findOne({
        where: {
          email: decoded.email
        }
      })
      if (!user)
        return resp(404, null, "Something went wrong. Try to register again.")

      return resp(200, user)
    } catch (error) {
      return resp(410, null, "Expired! Try to login again")
    }
  }
}

export default UserService
