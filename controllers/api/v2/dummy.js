module.exports.dummy = (req, res) => {
    return res.json(200, {
        message: "Testing v2 api"
    })
}