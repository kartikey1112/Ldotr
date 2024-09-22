const mongoose = require("mongoose");
const User = require("./userSchema");

mongoose
  .connect("mongodb://127.0.0.1:27017/Users", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
  });

const insertUser = async () => {
  try {
    const newUser = new User({
      name: "kartikey Bajpai",
      age: 22,
      email:"test@innostax.com"
    });

    const result = await newUser.save();
    console.log("User created:", result);
  } catch (error) {
    console.error("Error creating user:", error.message);
  } finally {
    mongoose.connection.close(); 
  }
};


insertUser();

module.exports = { insertUser };
