import express, { Request, Response } from 'express';
import config from './config/config';
import initDB, { pool } from './config/db';
import { signUpRoutes } from './modules/auth/signup/signup.routes';


const app = express()
const port = config.connection_port

// parser
app.use(express.json())

initDB()

app.use('/api/v1/auth/signup', signUpRoutes)

app.get('/', (req: Request, res: Response) => {
    res.send('Hello Vehicle Rental System !')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
