import express, { Request, Response } from 'express';
import config from './config/config';
import initDB, { pool } from './config/db';


const app = express()
const port = config.connection_port

// parser
app.use(express.json())

initDB()

app.get('/', (req: Request, res: Response) => {
    res.send('Hello Vehicle Rental System !')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
