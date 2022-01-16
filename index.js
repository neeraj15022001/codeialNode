const express = require("express");
const app = express();
const PORT = 8000;
const expressLayouts = require("express-ejs-layouts")
const db = require("./config/mongoose")
const cookieParser = require("cookie-parser")
//set up the view engine
app.use(express.static("./assets"))
app.use(expressLayouts);
app.set("layout extractStyles", true);
app.set("layout extractScripts", true);
app.use(cookieParser())
app.use(express.urlencoded());
app.use("/", require("./routes"));
app.set("view engine", "ejs");
app.set("views", "./views");
//express router
app.listen(PORT, (err) => {
    if (err) {
        console.error("Error while running server");
        return;

    }
    console.info("Server is up and running on PORT: ", PORT);
})