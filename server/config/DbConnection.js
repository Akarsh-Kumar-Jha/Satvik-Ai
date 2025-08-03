const mongoose = require('mongoose');
require('dotenv').config();

exports.dbConnect = () => {
    mongoose.connect(process.env.MONGO_URL)
    .then(console.log("DataBase Connection Done"))
    .catch((error) => {
        console.log("Error While DataBase Connection",error.message);
        process.exit(1);
    })
}