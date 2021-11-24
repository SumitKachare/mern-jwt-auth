const User = require('../models/User.model')
const ErrorHandler = require('../utils/errorClass')
const jwt = require("jsonwebtoken")

const authVerify = async (req, res, next) => {
    let token

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1]
    }

    if (!token) {
        return next(new ErrorHandler("Please Authenticate", 401))
    }

    try {

        // this will get the user id which was provided during jwt sign
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        const user = await User.findById(decoded.id)

        if (!user) {
            return next(new ErrorHandler("User not Found", 404))
        }

        req.user = user

        next()
    } catch (e) {
        ;
        return next(new ErrorHandler("Please Authenticate", 401))
    }
}

module.exports = authVerify
