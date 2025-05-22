const mongoose = require("mongoose");
const connectDB = require("./db");
const User = require("./models/users");

// update the same doc twice in the same session
const updateSameDocTwice = async () => {
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
    await doc.save({ session: session });
    console.log("First update done");

    const doc2 = await User.findById(user._id).session(session);
    doc2.balance += 300;
    await doc2.save({ session });
    console.log("Second update done");

    await session.commitTransaction();
  } catch (err) {
    console.error("Error:", err.message);
    await session.abortTransaction();
    console.log("Transaction aborted");
  } finally {
    session.endSession();
  }

  const finalUser = await User.findById(user._id);
  console.log("Final User after updates:", finalUser);
};
updateSameDocTwice();
