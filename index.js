const express = require("express");
const app = express();
const PORT = 8000;
const expressLayouts = require("express-ejs-layouts")
const db = require("./config/mongoose")
const cookieParser = require("cookie-parser")
const session = require("express-session")
const passport = require("passport")
const passportLocal = require("./config/passport-local-strategy")
//set up the view engine
app.use(express.static("./assets"))
app.use(expressLayouts);
app.set("layout extractStyles", true);
app.set("layout extractScripts", true);
app.use(express.urlencoded());
app.use(cookieParser())
app.set("views", "./views");
app.set("view engine", "ejs");
app.use(session({
    name: "neeraj",
//    TODO change the secret  before deployment in production
    saveUninitialized: false,
    secret: "blahsomething",
    resave: false,
    cookie: {
        maxAge: (1000 * 60 * 100)
    }
}));
app.use(passport.initialize());
app.use(passport.session());
app.use("/", require("./routes"));
//express router
app.listen(PORT, (err) => {
    if (err) {
        console.error("Error while running server");
        return;

    }
    console.info("Server is up and running on PORT: ", PORT);
})