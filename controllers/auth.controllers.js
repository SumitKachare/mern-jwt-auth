const User = require('../models/User.model')
const ErrorResponse = require('../utils/errorClass')
const ErrorClass = require('../utils/errorClass')
const sendEmail = require("../utils/sendMail")
const crypto = require("crypto")

exports.register = async (req, res, next) => {
    const { username, password, email } = req.body


    try {
        const user = await User.create({
            email, username, password
        })

        sendToken(user, 201, res)
    } catch (error) {
        next(error)
    }

}

exports.login = async (req, res, next) => {

    const { email, password } = req.body

    const user = await User.findOne({ email }).select('+password')

    if (!user) {
        return next(new ErrorResponse("Invalid Crediantials", 400))
    }

    const isPasswordMatch = await user.comparePassword(password)

    if (!isPasswordMatch) {
        return next(new ErrorResponse("Invalid Crediantials", 400))
    }

    sendToken(user, 200, res)
}


exports.forgetPassword = async (req, res, next) => {
    const { email } = req.body

    if (!email) {
        return next(new ErrorResponse("Bad Request", 404))
    }

    try {
        const user = await User.findOne({ email })

        if (!user) {
            return next(new ErrorResponse("Email Error", 404))
        }

        const resetToken = user.getResetToken()

        await user.save()

        const resetUrl = `http://localhost:3000/reset-password/${resetToken}`

        const message = `
        <h1>Reset password URL<h1>
        <p>Please go to this link to reset your password</p>
        <a href=${resetUrl} clicktracking=off>${resetUrl}</a>
        `

        try {
            sendEmail({
                to: user.email,
                subject: "Password Reset Request",
                text: message
            })

            res.status(200).send({ success: true, data: "Email send" })
        } catch (error) {
            user.resetPasswordToken = undefined
            user.resetPasswordExpire = undefined

            await user.save()

            return next("Email Error", 500)
        }

    } catch (error) {
        next(error)
    }
}

exports.resetPassword = async (req, res, next) => {

    const resetPasswordToken = crypto.createHash("sha256").update(req.params.resetToken).digest("hex")

    try {
        const user = await User.findOne({ resetPasswordToken, resetPasswordExpire: { $gt: Date.now() } })


        if (!user) {
            return next(new ErrorResponse("Invalid reset token", 400))
        }

        user.password = req.body.password
        user.resetPasswordToken = undefined
        user.resetPasswordExpire = undefined

        user.save()

        res.status(200).send({
            status: "success",
            data: "Reset Successfull"
        })

    } catch (error) {
        next(error)
    }
}

// Util functions

function sendToken(user, statusCode, res) {
    const token = user.getSignedJwtToken()

    res.status(statusCode).send({ success: true, data: user, token })
}