import sequelize, { Model } from "sequelize"
import db from "."
class Session extends Model {
  declare sid: string
}

Session.init(
  {
    sid: {
      type: sequelize.STRING,
      allowNull: false,
      primaryKey: true
    },
    userId: sequelize.STRING,
    expires: sequelize.DATE,
    data: sequelize.TEXT
    // sid: {
    //   type: sequelize.STRING,
    //   allowNull: false,
    //   primaryKey: true
    // },
    // agent: {
    //   type: sequelize.STRING,
    //   defaultValue: "",
    //   allowNull: true
    // },
    // valid: {
    //   type: sequelize.BOOLEAN,
    //   allowNull: false
    // }
  },
  {
    sequelize: db,
    tableName: "Session",
    timestamps: false
  }
)

export default Session
