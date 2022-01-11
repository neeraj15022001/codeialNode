module.exports.profile = (req, res) => {
    return res.send("<h1>User Profile</h1>");
}

module.exports.about = (req, res) => {
    return res.send("<h1>Rendering user about page</h1>");
}