import "dotenv/config"
import bodyParser from "body-parser"
import express, { Router, type Application } from "express"
import morgan from "morgan"
import cors, { CorsOptions } from "cors"
import routes from "./routes/index.routes"
import cookieParser from "cookie-parser"
import { sessionInit } from "./utils/session"
import { deserializeUser } from "./middleware/deserializeUser"
import { errorHandler } from "./middleware/ErrorHandler"
import { OS } from "./utils/system"
import { IUserSession } from "./types/types"
declare module "express-serve-static-core" {
  interface Request {
    user: IUserSession
  }
}

class App {
  private app: Application
  declare apiRoutes: Router[]
  constructor() {
    this.app = express()
    this.apiRoutes = routes

    this.config()
    this.startSession()
    this.middleware()
    this.routes()
  }
  private middleware(): void {
    this.app.use(deserializeUser)
    this.app.use(errorHandler)
  }
  private routes(): void {
    this.app.use(routes)
  }
  private config(): void {
    const whitelist = OS.ENV.CORS.ALLOWED_ORIGINS

    const corsOptions: CorsOptions = {
      origin: function (origin, callback) {
        if (!origin || whitelist.indexOf(origin!) !== -1) {
          callback(null, true)
        } else {
          callback(new Error("Not allowed by CORS"))
        }
      },
      credentials: true
    }
    this.app.use(cors(corsOptions))
    this.app.use(bodyParser.json())
    this.app.use(
      morgan(":method :url :status :res[content-length] - :response-time ms")
    )

    this.app.use(cookieParser())
  }
  public listen(port?: number): void {
    this.app.listen(port, () => {
      console.log("Server started on PORT -> ", port)
    })
  }
  private startSession() {
    sessionInit(this.app)
  }
}

export default App
