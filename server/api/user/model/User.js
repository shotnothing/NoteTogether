const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: [true, "Please include your username!"]
  },
  email: {
    type: String,
    required: [true, "Please include your email!"]
  },
  password: {
    type: String,
    required: [true, "Please include your password!"]
  },
  notes: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Note',
    default: []
  },
  purchased: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Note',
    default: []
  },  
  favourited: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Note',
    default: []
  },  
  credits: {
    type: Number,
    required: true,
    default: 10
  },
  points: {
    type: Number,
    required: true,
    default: 0,
  },
  voted: {
    type: [
      {
        id: mongoose.Schema.Types.ObjectId,
        isUpvote: Boolean
      }
    ],
    default: []
  },
  tokens: [
    {
      token: {
        type: String,
        required: true
      }
    }
  ],
});

userSchema.pre("save", async function(next) {
  // Hash the password before saving the user model
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

//this function generates an auth token for the user
userSchema.methods.generateAuthToken = async function() {
  const user = this;
  const token = jwt.sign(
    { _id: user._id, username: user.username, email: user.email },
    "secret",
    {expiresIn: "3h"}
  );
  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};

//this method search for a user by email and password.
userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });
  console.log(user);
  if (!user) {
    throw new Error({ error: "No such email was found!" });
  }
  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) {
    throw new Error({ error: "Wrong password!" });
  }
  return user;
};

const User = mongoose.model("User", userSchema);
module.exports = User;
