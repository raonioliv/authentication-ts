import { Router } from "express"
import { UserControllers } from "../controllers/user.ctrl"
import schemaValidator from "../middleware/Validator"

const userCtrl = new UserControllers()

export const userRoutes: Router = Router()

userRoutes.post(
  "/register",
  schemaValidator("auth/registration"),
  userCtrl.create.bind(userCtrl)
)
userRoutes.post("/login", userCtrl.login.bind(userCtrl))
userRoutes.post("/logout", userCtrl.logout.bind(userCtrl))
userRoutes.get(
  "/accountRecovery",
  schemaValidator("account/recovery"),
  userCtrl.accountRecovery.bind(userCtrl)
)
userRoutes.get(
  "/confirmAccount",
  userCtrl.confirmAccountCreation.bind(userCtrl)
)
