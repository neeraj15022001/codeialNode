const mongoose = require("mongoose");

main()
    .then((r) => {
        console.log("Connected to DB successfully")
        handleSuccess(r);
    })
    .catch(err => {
        console.log("Error connecting to DB ", err);
        handleError()
    })

async function main() {
    return await mongoose.connect("mongodb://localhost:27017/codeial_development")
}

function handleSuccess(db) {
    module.exports = db
}

function handleError() {
    module.exports = null;
}