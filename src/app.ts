import express, { Application, Request, Response } from 'express'
import cors from 'cors'
import userRoute from './app/modules/user/user.route'
import globalErrorHandler from './app/middlewares/globalErrorHandler'

const app: Application = express()

app.use(cors())

// parse data
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// application routes
app.use('/api/v1/user', userRoute)

app.use('/', (req: Request, res: Response) => {
  res.send('Hey...')
})

// global error handler
app.use(globalErrorHandler)

export default app
