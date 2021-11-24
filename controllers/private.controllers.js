exports.getPrivateData = (req, res, next) => {
    res.status(200).send({
        status: "success",
        data: "You got access to private Route"
    })
}

