const express = require("express")
const { register, login, forgetPassword, resetPassword } = require("../controllers/auth.controllers")
const router = express.Router()

router.route('/register').post(register)

router.route('/login').post(login)

router.route('/forgetPassword').post(forgetPassword)

router.route('/resetPassword/:resetToken').put(resetPassword)

module.exports = router