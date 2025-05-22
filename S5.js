const mongoose = require("mongoose");
const connectDB = require("./db");
const User = require("./models/users");

// update without using session
const updateWithoutSession = async () => {
  await connectDB();

  const user = await User.create({ name: "Shreya", balance: 1000 });
  console.log("Initial User:", user);

  const updatedUser = await User.findByIdAndUpdate(
    user._id,
    { $inc: { balance: 500 } },
    { new: true }
  );
  console.log("Updated User without session:", updatedUser);

  const finalUser = await User.findById(user._id);
  console.log("Final User after update without session:", finalUser);
};
updateWithoutSession();