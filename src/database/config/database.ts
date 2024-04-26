import "dotenv/config"
import { Options } from "sequelize"
import { OS } from "../../utils/system"

const { DB_USER, DB_NAME, DB_PASSWORD, DB_HOST } = OS.ENV.DB

const config: Options = {
  username: DB_USER,
  database: DB_NAME,
  password: DB_PASSWORD,
  host: DB_HOST,
  dialect: "mysql"
}

export = config
