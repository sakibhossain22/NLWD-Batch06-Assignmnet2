import path from "path"
import dotenv from "dotenv"


dotenv.config({ path: path.join(process.cwd(), ".env") })

const config = {
    connection_string : process.env.CONNECTION_STRING,
    connection_port : process.env.PORT,
    secret : process.env.SECRET
}

export default config