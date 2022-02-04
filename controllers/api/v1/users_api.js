const User = require("../../../models/users_schema")
const jwt = require("jsonwebtoken")
//create user session
module.exports.createSession = async (req, res) => {
    try {
        let user = await User.findOne({email: req.body.email});
        console.log("from users_api", user);
        if (!user || user.password !== req.body.password) {
            return res.json(422, {
                message: "Invalid username or password"
            })

        }
        return res.json(200, {
            message: "Sign in successfull, here is your token, please kepp it safe",
            data: {
                token: jwt.sign(user.toJSON(), 'codeial', {expiresIn: '10000000'})
            }
        })
    } catch (e) {
        console.log("Error", e);
        return res.json(500, {
            message: "Internal Server Error"
        })
    }

}