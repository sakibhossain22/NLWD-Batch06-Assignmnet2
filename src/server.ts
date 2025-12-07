import express, { Request, Response } from 'express';
import config from './config/config';
import initDB, { pool } from './config/db';
import { signUpRoutes } from './modules/auth/signup/signup.routes';
import { signInRoutes } from './modules/auth/signin/signin.routes';
import { vehicleRoutes } from './modules/vehicle/vehicle.routes';
import { userRoutes } from './modules/user/user.routes';
import { bookingRoutes } from './modules/booking/booking.routes';


const app = express()
const port = config.connection_port

// parser
app.use(express.json())

initDB()

// routes --> controller --> service
app.use('/api/v1/auth/signup', signUpRoutes)
app.use('/api/v1/auth/signin', signInRoutes)
// Vehicle
app.use('/api/v1/vehicles', vehicleRoutes)
// User 
app.use('/api/v1/users', userRoutes)
// Booking`
app.use('/api/v1/bookings', bookingRoutes)




// route Route api
app.get('/', (req: Request, res: Response) => {
    res.send('Hello Vehicle Rental System !')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
