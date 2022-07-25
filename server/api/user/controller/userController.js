const User = require("../model/User");
const Note = require("../../note/model/Note");

const noteController = require("../../note/controller/noteController");

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
    res.status(400).json({ err: "Registration Failed" });
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
    res.status(400).json({ err: "Login Failed" });
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
    res.status(400).json({ err: "User Details Retrieval Failed" });
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
                            },
                            select: {
                              creditedVote: 0,
                              creditedReview: 0,
                              creditedFavourite: 0,
                            }
                          });


    let publishedNotes = [];
    let unpublishedNotes = [];
    for (let i = 0; i < notes.notes.length; i++) {
      let note = notes.notes[i];
      if (note.isPublished) {
        publishedNotes.push(note);
      } else {
        unpublishedNotes.push(note);
      }
    }

    await resolveAllForks(notes.notes);

    res.status(200).json({ published: publishedNotes, unpublished: unpublishedNotes });
  } catch (err) {
    console.log(err);
    res.status(400).json({ err: "Get User Created Notes Failed" });
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
                            },
                            select: {
                              creditedVote: 0,
                              creditedReview: 0,
                              creditedFavourite: 0,
                            }
                          });
    
    await resolveAllForks(notes.favourited);

    res.status(200).json(notes);
  } catch (err) {
    console.log(err);
    res.status(400).json({ err: "Get User Favourited Notes Failed" });
  }
};

exports.purchasedNotes = async (req, res) => {
  try {

    const userId = req.userData._id;

    let notes = await User.findById(userId)
                          .select('purchased')
                          .populate({
                            path: 'purchased',
                            populate: {
                              path: 'userId',
                              select: 'username',
                              model: 'User'
                            },
                            select: {
                              creditedVote: 0,
                              creditedReview: 0,
                              creditedFavourite: 0,
                            },
                            match: {
                              "userId": { $ne: userId.toString() }
                            }
                          });
    
    await resolveAllForks(notes.purchased);

    res.status(200).json(notes);
  } catch (err) {
    console.log(err);
    res.status(400).json({ err: "Get User Purchased Notes Failed" });
  }
};

exports.bestUsers = async (req, res) => {
  try {
    const userId = req.userData._id;

    let users = await User
      .find()
      .sort({points: -1})
      .select("username points")
      .limit(5);

    res.status(200).json({ users: users });
  } catch (err) {
    console.log(err);
    res.status(400).json({ err: "Get Best Users Failed" });
  }
}

async function resolveAllForks(notes) {
  for (let i = 0; i < notes.length; i++) {
    let note = notes[i];
    if (!!note.forkOf){
      note.content = await noteController.resolveFork(note);
    }
  }
}

// favouritedNotes
// purchasedNotes