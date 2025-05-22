const mongoose = require("mongoose");
const connectDB = require("./db");
const User = require("./models/users");

// update with session and then update directly
const concurrentSessionsDemo = async () => {
  await connectDB();

  const user = await User.create({ name: "Shreya", balance: 1000 });
  console.log("User created:", user);

  const sessionA = await mongoose.startSession();
  sessionA.startTransaction();
  const docA = await User.findOneAndUpdate(
    { _id: user._id },
    { $inc: { balance: 200 } },
    { new: true, session: sessionA }
  );
  await docA.save({ session: sessionA });
  console.log("Session A updated balance not committed");

  const userDirect = await User.findByIdAndUpdate(
    user._id,
    { $inc: { balance: 100 } },
    { new: true }
  );
  console.log("Direct update done. New balance:", userDirect.balance);

  await sessionA.commitTransaction();
  sessionA.endSession();

  const finalUser = await User.findById(user._id);
  console.log("Final balance after commit:", finalUser.balance);
};

concurrentSessionsDemo();
