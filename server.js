const express = require("express")
const dotenv = require("dotenv")
const authRoute = require('./routes/auth.routes')
const privateRoute = require('./routes/private.routes')
const connectDB = require('./config/db.config')
const errorHandler = require('./middlewares/errorHandler')

// Initialize express app
const app = express()

// Initialize dotenv -> willl load all the config
dotenv.config()

// declare port
const port = process.env.PORT || 3000

// connect to DB
connectDB()

// parse req body
app.use(express.json())

// add auth router
app.use('/api/auth', authRoute)

// add private router
app.use('/api/private', privateRoute)

// error handler middleware
app.use(errorHandler)

const server = app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})

process.on('unhandledRejection', (err, promise) => {
    console.log(`Logged error : ${err}`);
    server.close(() => process.exit(1))
})