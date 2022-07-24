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
  length: {
    type: Number,
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
  isCheatsheet: {
    type: Boolean,
    required: true,
    default: false,
  },
  forkOf: {
    type: mongoose.Schema.Types.ObjectId,
    required: false
  },
  votes: {
    type: Number,
    required: true,
    default: 0
  },
  favourites: {
    type: Number,
    required: true,
    default: 0
  },
  reviews: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Review',
    default: []
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  creditedVote: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Credited Vote',
    default: []
  },
  creditedFavourite: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Credited Favourite',
    default: []
  },
  creditedReview: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Credited Review',
    default: []
  },
});

const Note = mongoose.model("Note", noteSchema);
module.exports = Note;