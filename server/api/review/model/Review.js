const mongoose = require("mongoose");
const ReviewSchema = mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please include a title for the Review!"]
  },
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
  isDeleted: {
    type: Boolean,
    required: true,
    default: false,
  },
  noteId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  credited: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Credited',
    default: []
  },
});

const Review = mongoose.model("Review", ReviewSchema);
module.exports = Review;