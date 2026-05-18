const mongoose = require("mongoose");

const connectToDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDb Connected");
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

module.exports = connectToDb;
