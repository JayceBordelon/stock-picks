const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10; // Cost factor for hashing
const Schema = mongoose.Schema;

// Define the User schema
const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true // Ensures email uniqueness within the collection
  },
  username: {
    type: String,
    required: true,
    unique: true // Ensures username uniqueness within the collection
  },
  password: {
    type: String,
    required: true
  },
  posts: [{
    type: Schema.Types.ObjectId,
    ref: 'Post' // Assumes you have a Post model defined elsewhere
  }],
  comments: [{
    type: Schema.Types.ObjectId,
    ref: 'Comment' // Assumes you have a Comment model defined elsewhere
  }]
}, { timestamps: true }); // Adds createdAt and updatedAt timestamps

// Hash the user's password before saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('hashedPassword')) return next();
    try {
      const hash = await bcrypt.hash(this.password, saltRounds);
      this.password = hash;
      next();
    } catch (err) {
      next(err);
    }
  });
  
// Compare the given password with the hashed password in the database
userSchema.methods.comparePassword = async function (password) {
    return bcrypt.compare(password, this.password);
  };
// Compile the schema into a model
const User = mongoose.model('User', userSchema);

module.exports = User;
