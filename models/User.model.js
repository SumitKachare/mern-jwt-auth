const mongoose = require("mongoose")
const crypto = require("crypto")
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        trim: true,
        required: [true, "Please provide a username"]
    },
    email: {
        type: String,
        required: [true, "Please provide a email"],
        match: [/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, "Please provide a valid email"],
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: [true, "Please provide a password"],
        minlength: [6, "Please provide a password greater than 6 letters"],
        select: false
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date

}, {
    toJSON: {
        transform: function (doc, ret) {
            delete ret.password;
        }
    }
})

// method to compare password
userSchema.methods.comparePassword = async function (password) {

    // here this is user instance
    let user = this
    return await bcrypt.compare(password, user.password)
}

// method to generate user token
userSchema.methods.getSignedJwtToken = function () {

    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE })
}

// method to generate resetpassword Token
userSchema.methods.getResetToken = function () {

    const resetToken = crypto.randomBytes(20).toString("hex")



    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex")
    this.resetPasswordExpire = Date.now() + 10 * (60 * 1000)

    return resetToken

}

// this will run before it is saved in db
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next()
    }

    const salt = await bcrypt.genSalt(8)

    this.password = await bcrypt.hash(this.password, salt)
    next()
})

const User = mongoose.model('User', userSchema)

module.exports = User