class Enviroment {
  protected variables = [
    "PORT",
    "DB_HOST",
    "DB_USER",
    "DB_PASSWORD",
    "DB_USER",
    "JWT_SECRET"
  ]
  ENV: {
    NODE_ENV: string
    EMAIL: {
      API_KEY: string
      SERVICE_DOMAIN: string
    }
    API: {
      PORT: number
      BASE_URL: string
    }
    DB: {
      DB_PASSWORD: string
      DB_HOST: string
      DB_USER: string
      DB_NAME: string
    }
    SECURITY: {
      COOKIE_SECRET_KEY: string
      JWT_SECRET: string
    }
    CORS: {
      ALLOWED_ORIGINS: string[]
    }
  }
  constructor() {
    this.checkSystem()
    this.ENV = {
      NODE_ENV: process.env["NODE_ENV"]!,
      EMAIL: {
        API_KEY: process.env["EMAIL_API_KEY"]!,
        SERVICE_DOMAIN: process.env["EMAIL_SERVICE_DOMAIN"]!
      },
      API: {
        PORT: Number(process.env["PORT"]),
        BASE_URL: process.env["BASE_URL"]!
      },
      DB: {
        DB_PASSWORD: process.env["DB_PASSWORD"]!,
        DB_HOST: process.env["DB_HOST"]!,
        DB_USER: process.env["DB_USER"]!,
        DB_NAME: process.env["DB_NAME"]!
      },
      SECURITY: {
        JWT_SECRET: process.env["JWT_SECRET"]!,
        COOKIE_SECRET_KEY: process.env["COOKIE_SECRET_KEY"]!
      },
      CORS: {
        ALLOWED_ORIGINS: this.getWhitelist() || []
      }
    }
  }

  protected getWhitelist(): string[] | undefined {
    const envURLPrefix = "ALLOWED_ORIGIN_"
    const whitelist: string[] = []
    Object.keys(process.env).forEach((key) => {
      if (key.startsWith(envURLPrefix)) whitelist.push(process.env[key]!)
    })

    return whitelist
  }
  protected checkSystem(): void {
    for (const variable of this.variables) {
      if (process.env[variable] === undefined || process.env[variable] === "") {
        console.log(`The enviroment is missing the "${variable}" variable.`)
        process.exit(1)
      }
    }
  }
}

export const OS = new Enviroment()
