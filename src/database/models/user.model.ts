import sequelize, { Model } from "sequelize"
import db from "."
import crypt from "../../utils/crypt"

class User extends Model {
  declare id: number
  declare firstName: string
  declare lastName: string
  declare email: string
  declare password: string
}

User.init(
  {
    id: {
      type: sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
      unique: true,
      primaryKey: true
    },
    firstName: {
      type: sequelize.STRING,
      allowNull: false
    },
    lastName: {
      type: sequelize.STRING,
      allowNull: true
    },
    email: {
      type: sequelize.STRING,
      unique: true,
      allowNull: false
    },
    password: {
      type: sequelize.STRING,
      allowNull: false
    }
  },
  {
    hooks: {
      beforeCreate: async (user) => {
        user.password = await crypt.hash(user.password)
      },
      beforeUpdate: async (user, options) => {
        if (options.fields?.includes("password")) {
          user.password = await crypt.hash(user.password)
        }
      }
    },
    sequelize: db,
    tableName: "user",
    timestamps: false,
    defaultScope: {
      attributes: { exclude: ["password"] }
    },
    scopes: {
      withPassword: { attributes: { include: ["password"] } }
    }
  }
)

export default User
