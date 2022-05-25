const Note = require("../model/Note");
const User = require("../../user/model/User");

const PER_PAGE = 10;

exports.createNote = async (req, res) => {
  try {
    // Id of requestor
    const userId = req.userData._id;
    
    // Checks whether note of the same title has been created by the user
    const noteSearch = await Note.find({
      title: req.body.title,
      userId: userId,
      isDeleted: false
    });

    const note = new Note({
      title: req.body.title,
      content: req.body.content,
      userId: userId
    });

    // User is not allowed to create two notes of the same name
    if (noteSearch.length >= 1) {
      return res.status(409).json({
        note: noteSearch[0],
        err: "You have already created a note with this name!"
      });
    }

    // Adds new note to user's collection
    let savedNote = await note.save();
    let user = await User.findById(userId);
    user.notes = [note._id, ...user.notes];
    await user.save();

    res.status(200).json({ note: savedNote });
  } catch (err) {
    res.status(400).json({ err: err });
  }
}

exports.readNote = async (req, res) => {
  try {
    // Note to be read
    const noteId = req.body.noteId;
    let note = await Note.findById(noteId);

    // Id of the requestor
    const userId = note.userId;

    // Id of the creator of the note
    const noteCreatorId = note.userId;
    let user = await User.findById(userId);
    const username = user.username;

    // Can access the note if you created it, or if it's published
    if (!note.isPublished && noteCreatorId != userId) {
      res.status(401).json({ err: "Not authorised" });
    }

    res.status(200).json({
      title: note.title,
      content: note.content,
      username: username
    });
  } catch (err) {
    res.status(400).json({ err: err });
  }
}

exports.updateNote = async (req, res) => {
  try {
    // Note to be saved
    const noteId = req.body.noteId;
    let note = await Note.findById(noteId);

    // Id of the requestor
    const userId = req.userData._id;
    // Id of the note creator
    const noteCreatorId = note.userId;

    // Cannot update a note that does not belong to you
    if (noteCreatorId != userId) {
      return res.status(401).json({ err: "Not authorised!" });
    }
    
    // Cannot update a published or deleted note
    if (note.isPublished || note.isDeleted) {
      return res.status(405).json({
        note: note,
        err: "Cannot update a published or deleted note!"
      });
    }

    // Replaces the content
    note.content = req.body.content;
    note.dateLastUpdated = Date.now();
    await note.save();
    res.status(200).json({ note: note });
  } catch (err) {
    res.status(400).json({ err: err });
  }
}

exports.deleteNote = async (req, res) => {
  try {
    // Note to be deleted
    const noteId = req.body.noteId;
    let note = await Note.findById(noteId);

    // Cannot delete a deleted note
    if (note.isDeleted) {
      return res.status(405).json({
        note: note,
        err: "Note has already been deleted!"
      });
    }

    // Updates the flags for the note
    note.isDeleted = true;
    note.isPublished = false;
    const savedNote = await note.save();

    // Delete note from the user's perspective
    const userId = req.userData._id;
    let user = await User.findById(userId);
    user.notes.splice(user.notes.indexOf(noteId), 1);
    await user.save();

    res.status(200).json({ note: savedNote });
  } catch (err) {
    res.status(400).json({ err: err });
  }
}

exports.publishNote = async (req, res) => {
  try {
    // Note to be published
    const noteId = req.body.noteId;
    let note = await Note.findById(noteId);

    // Id of the requestor
    const userId = req.userData._id;
    let user = await User.findById(userId);
    // Id of the note creator
    const noteCreatorId = note.userId;

    // Cannot publish note that does not belong to you
    if (noteCreatorId != userId) {
      return res.status(401).json({ err: "Not authorised!" });
    }

    // Cannot published note that has already been published
    if (note.isPublished) {
      return res.status(405).json({
        note: note,
        err: "Note already published"
      });
    }

    // Updates note entries
    note.isPublished = true;
    note.datePublished = Date.now();
    await note.save();

    // Create new private note that can still be edited
    const newPrivateNote = new Note({
      title: note.title,
      userId: noteCreatorId,
      content: note.content,
    });

    // Adds new note to user's collection
    const savedNote = await newPrivateNote.save();
    user.notes = [newPrivateNote._id, ...user.notes];
    await user.save();

    res.status(200).json({ note: savedNote });
  } catch (err) {
    res.status(400).json({ err: err });
  }
}

exports.searchNote = async (req, res) => {
  try {
    const notes = await Note
      .find({
        title: { $regex: new RegExp(req.body.searchTerm, "i") },
        isPublished: true,
        isDeleted: false
      })
      .sort({ datePublished: -1 })
      .skip(PER_PAGE*(req.body.page-1))
      .limit(PER_PAGE)
      .populate("searchResults", "title userId datePublished");

    notes.forEach(async json => {
      json.username = User.findById(json.userId);
      delete json.userId;
      return json;
    });
    
    res.status(200).json(notes);
  } catch (err) {
    res.status(400).json({ err: err });
  }
}