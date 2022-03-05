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
    return await mongoose.connect(process.env.MONGO_URL)
}

function handleSuccess(db) {
    module.exports = db
}

function handleError() {
    module.exports = null;
}