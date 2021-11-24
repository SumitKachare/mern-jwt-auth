const express = require("express")
const { getPrivateData } = require("../controllers/private.controllers")
const authVerify = require('../middlewares/auth.middleware')
const router = express.Router()

router.route('/getPrivateData').get(authVerify, getPrivateData)

module.exports = router