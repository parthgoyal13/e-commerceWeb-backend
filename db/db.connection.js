const mongoose = require("mongoose");
require("dotenv").config();
const mongoURI = process.env.MONGODB;

const initializeDatabase = async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log("Connected Successfully");
  } catch (error) {
    console.log("Connection Failed", error);
  }
};

module.exports = { initializeDatabase };
