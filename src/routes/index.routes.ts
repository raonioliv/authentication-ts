import { Router } from "express"
import { userRoutes } from "./user.routes"

const routes: Router[] = [userRoutes]
export default routes
