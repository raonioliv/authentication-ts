import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { OS } from "./system"

class Crypto {
  async hash(data: string, salt?: string) {
    let hash: string
    if (!salt) {
      const randSalt = await bcrypt.genSalt(10)
      hash = await bcrypt.hash(data, randSalt)
    } else {
      hash = await bcrypt.hash(data, salt)
    }

    return hash
  }

  async compareHash(data: string, hash: string) {
    return await bcrypt.compareSync(data, hash)
  }

  encodeJWT(data: object, expiresIn?: string | number) {
    expiresIn = expiresIn ?? "30min"

    return jwt.sign(data, OS.ENV.SECURITY.JWT_SECRET, { expiresIn: expiresIn })
  }
  /**
   *
   * @param encoded
   * @param options
   *
   * @returns
   */
  verifyJWT<T>(encoded: string) {
    const verified = jwt.verify(encoded, OS.ENV.SECURITY.JWT_SECRET)
    return verified as T
  }
}

export default new Crypto()
