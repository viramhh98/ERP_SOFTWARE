//configuring the database

const { MongoURI } = require("./env.config.js");
const mongoose = require("mongoose");

async function connectToDatabase() {
  try {
    await mongoose.connect(MongoURI);
    console.log("Connected to MongoDB successfully!");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

module.exports = connectToDatabase;
