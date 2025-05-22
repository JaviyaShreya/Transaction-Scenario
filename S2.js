const mongoose = require("mongoose");
const connectDB = require("./db");
const User = require("./models/users");

// reading with session and then outside session
const sessiondemo = async () => {
  await connectDB();

  const user = await User.create({ name: "Shreya", balance: 500 });
  console.log("Initial User:", user);

  const session = await mongoose.startSession();
  session.startTransaction();

  const txnUser = await User.findOneAndUpdate(
    { _id: user._id },
    { $inc: { balance: 200 } },
    { new: true, session: session }
  )
  await txnUser.save({ session : session });
  console.log("Txn value updated");

  // read without session before commit
  const outsideRead = await User.findById(user._id);
  console.log("Outside session read:", outsideRead.balance); 

  await session.commitTransaction();
  session.endSession();

  const finalRead = await User.findById(user._id);
  console.log("After commit, balance is:", finalRead.balance); 
};

sessiondemo();
