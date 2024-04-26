import App from "./app"
import { OS } from "./utils/system"

const app = new App()

app.listen(OS.ENV.API.PORT)
