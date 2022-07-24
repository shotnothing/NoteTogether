const mongoose = require("mongoose");
const ReviewSchema = mongoose.Schema({
  content: {
    type: String
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
  dateLastUpdated: {
    type: Date,
    required: true,
    default: Date.now,
  },
  noteId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  votes: {
    type: Number,
    default: 0,
  },
  creditedVote: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Credited',
    default: []
  },
});

const Review = mongoose.model("Review", ReviewSchema);
module.exports = Review;