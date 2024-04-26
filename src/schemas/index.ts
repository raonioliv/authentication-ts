import Joi from "joi"
import { accountRecovery, registrationSchema } from "./user"
export default {
  "account/recovery": accountRecovery,
  "auth/registration": registrationSchema
} as { [key: string]: Joi.Schema }
