const mongoose = require("mongoose");
const noteSchema = mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please include a title for the note!"]
  },
  content: {
    type: [String]
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  dateCreated: {
    type: Date,
    required: true,
    default: Date.now,
  },
  datePublished: {
    type: Date,
  },
  dateLastUpdated: {
    type: Date,
    required: true,
    default: Date.now,
  },
  isPublished: {
    type: Boolean,
    required: true,
    default: false,
  },
  isDeleted: {
    type: Boolean,
    required: true,
    default: false,
  },
  forkOf: {
    type: mongoose.Schema.Types.ObjectId,
    required: false
  }
});

const Note = mongoose.model("Note", noteSchema);
module.exports = Note;