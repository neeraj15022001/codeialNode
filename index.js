const express = require("express");
const app = express();
const PORT = 8000;
const expressLayouts = require("express-ejs-layouts")
const db = require("./config/mongoose")
const cookieParser = require("cookie-parser")
const session = require("express-session")
const passport = require("passport")
const passportLocal = require("./config/passport-local-strategy")
const MongoStore = require("connect-mongo")
const sassMiddleware = require("@gompa/node-sass-middleware")
app.use(sassMiddleware({
    src: "./assets/scss/",
    dest: "./assets/css/",
    debug: true,
    outputStyle: "extended",
    prefix: "/css"
}))
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
    },
    store: MongoStore.create({
            mongoUrl: 'mongodb://localhost:27017/codeial_development',
            autoremove: 'disabled'
        },
        function (err) {
            console.log(err || 'connect-mongo success ok')
        })
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser)
app.use("/", require("./routes"));
//express router
app.listen(PORT, (err) => {
    if (err) {
        console.error("Error while running server");
        return;

    }
    console.info("Server is up and running on PORT: ", PORT);
})