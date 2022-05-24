const Note = require("../model/Note");
const User = require("../../user/model/User");
const auth = require

const PER_PAGE = 10;

exports.createNote = async (req, res) => {
  try {
    const userId = req.userData._id;
    const note = new Note({
      title: req.body.title,
      content: req.body.content,
      userId: userId
    });
    let data = await note.save();
    let user = await User.findById(userId);
    user.notes = [note._id, ...user.notes];
    await user.save();

    res.status(200).json({ data });
  } catch(err) {
    res.status(400).json({ err: err });
  }
}

exports.readNote = async (req, res) => {
  try {
    const noteId = req.body.noteId;
    let note = await Note.findById(noteId);
    const userId = note.userId;
    let user = await User.findById(userId);
    const username = user.username;
    console.log(username);

    res.status(200).json({
      title: note.title,
      content: note.content,
      username: username
    });
  } catch(err) {
    res.status(400).json({ err: err });
  }
}

exports.updateNote = async (req, res) => {
  try {
    const userId = req.userData._id;
    let user = await User.findById(userId);

    // Note to be saved
    const noteId = req.body.noteId;
    let note = await Note.findById(noteId);
    
    // Create new note if current has been published
    if (note.isPublished || note.isDeleted) {
      const newPrivateNote = new Note({
        title: note.title,
        userId: userId,
        content: req.body.content
      });
      const data = await newPrivateNote.save();
      user.notes = [newPrivateNote._id, ...user.notes];

      return res.status(200).json({ data });
    }

    note.content = req.body.content;
    res.status(200).json({ data });
  } catch(err) {
    res.status(400).json({ err: err });
  }
}

exports.deleteNote = async (req, res) => {
  try {
    const noteId = req.body.noteId;
    let note = await Note.findById(noteId);
    note.deleted = true;
    note.published = false;
    const data = await note.save();

    // Delete note from the user's perspective
    const userId = req.userData._id;
    let user = await User.findById(userId);
    user.notes.splice(user.notes.indexOf(noteId), 1);
    await user.save();

    res.status(200).json({ data });
  } catch(err) {
    res.status(400).json({ err: err });
  }
}

exports.publishNote = async (req, res) => {
  try {
    // Old note to be published
    const noteId = req.body.noteId;
    let note = await Note.findById(noteId);
    note.published = true;
    const data = await note.save();

    res.status(200).json({ data });
  } catch(err) {
    res.status(400).json({ err: err });
  }
}

exports.searchNote = async (req, res) => {
  try {
    const notes = await Note
      .find({
        title: { $regex: req.body.searchTerm },
        isPublished: true,
        isDeleted: false
      })
      .sort({ datePublished: -1 })
      .skip(PER_PAGE*(req.body.page-1))
      .limit(PER_PAGE)
      .populate('searchResults');
    
    res.status(200).json(notes);
  } catch(err) {
    res.status(400).json({ err: err });
  }
}