const mongoose = require("mongoose");
const connectDB = require("./db");
const User = require("./models/users");

// two sessions with one committing and one not
const demoTwoSessions = async () => {
  await connectDB();

  const user = await User.create({ name: "Shreya", balance: 100 });
  console.log("User created:", user);

  const sessionA = await mongoose.startSession();
  sessionA.startTransaction();

  const userA = await User.findById(user._id).session(sessionA);
  userA.balance += 500;
  await userA.save({ session: sessionA });
  console.log("Session A Updated balance (but not committed)");

  const userOutside = await User.findById(user._id);
  console.log("Outside Balance (should be old):", userOutside.balance);

  
  const sessionB = await mongoose.startSession();
  sessionB.startTransaction();
  const userB = await User.findById(user._id).session(sessionB);
  console.log("Session B Balance (should be old):", userB.balance);

  await sessionA.commitTransaction();
  sessionA.endSession();
  console.log("Session A Transaction committed");

  const finalUser = await User.findById(user._id);
  console.log("Final Read Balance (should reflect +500):", finalUser.balance);

  await sessionB.endSession();
};

demoTwoSessions();
