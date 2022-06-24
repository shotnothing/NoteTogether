const User = require("../model/User");
const Note = require("../../note/model/Note");

const MAX_USERNAME_LENGTH = 16;
const MIN_USERNAME_LENGTH = 3;
const MAX_PASSWORD_LENGTH = 16;
const MIN_PASSWORD_LENGTH = 3;

exports.registerNewUser = async (req, res) => {
  try {
    let isUser = await User.find({
        email: req.body.email, 
    });
    if (isUser.length >= 1) {
      return res.status(409).json({
        message: "Email is already in use!"
      });
    }

    isUser = await User.find({
        username: req.body.username, 
    });
    if (isUser.length >= 1) {
      return res.status(409).json({
        message: "Username is already in use!"
      });
    }

    // check username length
    if (req.body.username.length > MAX_USERNAME_LENGTH) {
      return res.status(401).json({ err: "Username is too long" });
    } else if (req.body.username.length < MIN_USERNAME_LENGTH) {
      return res.status(401).json({ err: "Username is too short" });
    }

    // check password length
    if (req.body.password.length > MAX_PASSWORD_LENGTH) {
      return res.status(401).json({ err: "Password is too long" });
    } else if (req.body.password.length < MIN_PASSWORD_LENGTH) {
      return res.status(401).json({ err: "Password is too short" });
    }

    const user = new User({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password
    });
    let data = await user.save();
    const token = await user.generateAuthToken(); // here it is calling the method that we created in the model
    res.status(201).json({ data, token });
  } catch (err) {
    console.log(err);
    res.status(400).json({ err: err });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const user = await User.findByCredentials(email, password);
    if (!user) {
      return res
        .status(401)
        .json({ error: "Login failed! Check your authentication credentials." });
    }
    const token = await user.generateAuthToken();
    res.status(201).json({ user, token });
  } catch (err) {
    console.log(err);
    res.status(400).json({ err: err });
  }
};

exports.getUserDetails = async (req, res) => {
  try {// Id of the requestor
    const userId = req.userData._id;
    let user = await User.findById(userId);
    if (!user) {
      return res
        .status(400)
        .json({ error: "User with that Id not found!" });
    }
    console.log(user);
    res.status(200).json({ userData: user });
  } catch (err) {
    console.log(err);
    res.status(400).json({ err: err });
  }
};

exports.createdNotes = async (req, res) => {
  try {

    const userId = req.userData._id;

    let notes = await User.findById(userId)
                          .select('notes')
                          .populate({
                            path: 'notes',
                            populate: {
                              path: 'userId',
                              select: 'username',
                              model: 'User'
                            }
                          });

    res.status(200).json({ notes: notes });
  } catch (err) {
    console.log(err);
    res.status(400).json({ err: err });
  }
};

exports.favouritedNotes = async (req, res) => {
  try {

    const userId = req.userData._id;

    let notes = await User.findById(userId)
                          .select('favourited')
                          .populate({
                            path: 'favourited',
                            populate: {
                              path: 'userId',
                              select: 'username',
                              model: 'User'
                            }
                          });

    res.status(200).json({ notes: notes });
  } catch (err) {
    console.log(err);
    res.status(400).json({ err: err });
  }
};

exports.purchasedNotes = async (req, res) => {
  try {

    const userId = req.userData._id;

    let notes = await User.findById(userId)
                          .select('purchased')
                          // .populate({
                          //   path: 'purchased',
                          //   populate: {
                          //     path: 'userId',
                          //     select: 'username',
                          //     model: 'User'
                          //   }
                          // });

    res.status(200).json({ notes: notes });
  } catch (err) {
    console.log(err);
    res.status(400).json({ err: err });
  }
};

// favouritedNotes
// purchasedNotes