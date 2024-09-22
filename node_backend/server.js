const express = require("express");
const app = express();
const cors = require('cors')
const mongoose = require("mongoose");


const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    required: true
  },
  email:{
    type:String,
    required:true
  }
});

const User = mongoose.model('User', userSchema);

mongoose
  .connect("mongodb://mongodb:27017/Users", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
  });


app.use(cors());
app.use(express.json());
app.get("/", async (req, res) => {
  let users = await User.find();
  res.send(users);
});


app.get("/user/:email", async (req,res)=>{
  const { email } = req.params;
   try {
    const user = await User.findOne({email});
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/users', async (req, res) => {
  console.log('req.body :>> ', req.body);
   console.log('req :>> ', Object.keys(req));
  const { name, email, age } = req.body;
  try {
    const newUser = new User({ name, email, age });
    await newUser.save();
    res.status(201).json(newUser); // Respond with the newly created user
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});


app.listen(3000, () => {
  console.log("app is running on port 3000");
});
