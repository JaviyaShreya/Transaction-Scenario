const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb+srv://shreyajaviya13:jk9d9d4lkZrrE5lv@cluster1.vyxeyz9.mongodb.net/testTxn"  );
  console.log("MongoDB Connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
};

module.exports = connectDB;
