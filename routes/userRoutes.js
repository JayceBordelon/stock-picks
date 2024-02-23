const express = require('express');
const router = express.Router();
const User = require('../schemas/userSchema'); // Adjust the path as necessary
const bcrypt = require('bcrypt');

// Register User
router.post('/register', async (req, res) => {
  try {
    const { email, username, password } = req.body;
    if (!email || !username || !password) {
        return res.status(400).send({message: 'Missing credentials'});
    }
    // Check if user already exists
    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
      return res.status(400).send({message: 'Email or Username already exists'});
    }
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const user = new User({
      email,
      username,
      password: hashedPassword, // Store the hashed password
    });

    // Save the user
    await user.save();
    console.log("Successful Registration: "+ user._id);
    return res.status(201).send({message: 'User registered successfully', uid: user._id});
  } catch (error) {
    return res.status(500).send({message: 'Error registering user'});
  }
});

// Login User
router.post('/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      // Find the user by email
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).send({message: 'User not found'});
      }
  
      // Compare submitted password with stored hashed password using the method
      if(await bcrypt.compare(password, user.password)){
            console.log("Successful Login: "+ user._id);
            return res.status(200).send({message: "Successful Login!", uid: user._id});
        }
        return res.status(401).send({message: "Invalid Credentials!"});
    } catch (error) {
      return res.status(500).send({message: 'Error logging in user'});
    }
  });
  

router.get('/', async (req, res) => {
    res.send("Hello");
});

module.exports = router;
