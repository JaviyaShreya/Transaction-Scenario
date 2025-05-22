const mongoose = require("mongoose");
const connectDB = require("./db");
const User = require("./models/users");

// aborting transaction manually
const abortTransactionDemo = async () => {
  await connectDB();

  const user = await User.create({ name: "Shreya", balance: 1000 });
  console.log("Initial User:", user);

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
   const doc = await User.findOneAndUpdate(
      { _id: user._id },
      { $inc: { balance: 200 } },
      { new: true, session : session }
    );
    await doc.save({ session : session });
    console.log("Balance updated inside transaction");

    await session.abortTransaction();
    console.log("Transaction aborted");

    const finalDoc = await User.findById(user._id);
    console.log("After abort, balance is :", finalDoc.balance);
  } catch (err) {
    console.error("Error:", err.message);
  } finally {
    session.endSession();
  }
};

abortTransactionDemo();
