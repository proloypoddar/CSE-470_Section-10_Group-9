const mongoose = require('mongoose');

const mongoURI = "mongodb://sakibk13:1318@ac-j2wsobm-shard-00-00.yrofbuj.mongodb.net:27017,ac-j2wsobm-shard-00-01.yrofbuj.mongodb.net:27017,ac-j2wsobm-shard-00-02.yrofbuj.mongodb.net:27017/?ssl=true&replicaSet=atlas-fr737c-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0";

const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("Connected to MongoDB Atlas");
  } catch (error) {
    console.error("Error connecting to MongoDB Atlas", error);
    process.exit(1);
  }
};

module.exports = connectDB;
