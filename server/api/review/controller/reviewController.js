const Review = require("../model/Review");
const User = require("../../user/model/User");
const Note = require("../../note/model/Note");

const PER_PAGE = 5;

exports.createReview = async (req, res) => {
  try {
    // Id of requestor
    const userId = req.userData._id;
    const noteId = req.body.noteId;

    // Create Review (assume first that its not a fork)
    var review = new Review({
      title: req.body.title,
      content: req.body.content,
      userId: userId,
      noteId: noteId
    });

    // Adds new Review to user's collection
    let savedReview = await review.save();
    let note = await Note.findById(noteId);
    note.reviews = [review._id, ...note.reviews];
    await note.save();

    res.status(200).json({ review: savedReview });
  } catch (err) {
    console.log(err);
    res.status(400).json({ err: err });
  }
}

exports.readReview = async (req, res) => {
  try {
    // Review to be read
    const reviewId = req.body.reviewId;
    let review = await Review.findById(reviewId);

    console.log("TEST")
    console.log(review)
    console.log(review.userId)

    // Id of the requestor
    const userId = review.userId;

    // Id of the creator of the Review
    let author = await User.findById(review.userId);

    res.status(200).json({
      title: review.title,
      content: review.content,
      author: author.username
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({ err: err });
  }
}

// exports.updateReview = async (req, res) => {
//   try {
//     // Review to be saved
//     const ReviewId = req.body.ReviewId;
//     let Review = await Review.findById(ReviewId);

//     // Id of the requestor
//     const userId = req.userData._id;
//     // Id of the Review creator
//     const ReviewCreatorId = Review.userId;

//     // Cannot update a Review that does not belong to you
//     if (ReviewCreatorId != userId) {
//       return res.status(401).json({ err: "Not authorised!" });
//     }

//     // Replaces the content
//     Review.content = req.body.content;
//     Review.dateLastUpdated = Date.now();
//     await Review.save();

//     res.status(200).json({ Review: Review });
//   } catch (err) {
//     res.status(400).json({ err: err });
//   }
// }

// exports.deleteReview = async (req, res) => {
//   try {
//     // Review to be deleted
//     const ReviewId = req.body.ReviewId;
//     let Review = await Review.findById(ReviewId);

//     // Cannot delete a deleted Review
//     if (Review.isDeleted) {
//       return res.status(405).json({
//         Review: Review,
//         err: "Review has already been deleted!"
//       });
//     }

//     // Updates the flags for the Review
//     Review.isDeleted = true;
//     const savedReview = await Review.save();

//     // Delete Review from the user's perspective
//     const userId = req.userData._id;
//     let user = await User.findById(userId);
//     user.Reviews.splice(user.Reviews.indexOf(ReviewId), 1);
//     await user.save();

//     res.status(200).json({ Review: savedReview });
//   } catch (err) {
//     res.status(400).json({ err: err });
//   }
// }

// exports.searchReview = async (req, res) => {
//   try {
//     const Reviews = await Review
//       .find({
//         title: { $regex: new RegExp(req.body.searchTerm, "i") },
//         isDeleted: false
//       })
//       .sort({ dateLastUpdated: -1 })
//       .skip(PER_PAGE*(req.body.page-1))
//       .limit(PER_PAGE)
//       .populate("userId", "username")
//       .select("title userId datePublished username");

//     res.status(200).json({ searchResults: Reviews });
//   } catch (err) {
//     res.status(400).json({ err: err });
//   }
// }