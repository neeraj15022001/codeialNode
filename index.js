const express = require("express");
const path = require("path");
const app = express();
const PORT = 8000;
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));    
app.listen(PORT, (err) => {
    if (err) {
        console.error("Error while running server");
        return;

    }
    console.info("Server is up and running on PORT: ", PORT);
})