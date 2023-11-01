const mongoose = require("mongoose");
const mongoURI = "mongodb://localhost:27017/?directConnection=true";

async function toMongo() {
  await mongoose
    .connect(mongoURI)
    .then(() => console.log("Connected to Mongo Successfully"))
    .catch((err) => console.log(err));
};

module.exports = toMongo;
