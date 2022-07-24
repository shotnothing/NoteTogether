const Review = require("../model/Review");
const User = require("../../user/model/User");

CREDITS_AWARDED_AUTHOR_UPVOTE = 1;

exports.voteReview = async (req, res) => {
  try {
    // Id of requestor
    const userId = req.userData._id;
    let user = await User.findById(userId);

    const reviewId = req.body.reviewId;
    let review = await Review.findById(reviewId);

    switch (req.body.action) {

      case "upvote":
        if (isVoted(review, user)) {
          if (isUpvote(review, user)) {
            return res.status(401).json({ err: "Review already upvoted" });
          } else {
            // clear downvote
            await clearVote(review, user, increase = true);

            // do upvote
            const status = await upvote(review, user);
            return res.status(200).json({ status: "Review changed to upvoted"});
          }
        } else {
          // do upvote
          const status = upvote(review, user);
          return res.status(200).json({ status: "Review upvoted"});
        }

        break;

      case "downvote":
        if (isVoted(review, user)) {
          if (!isUpvote(review, user)) {
            return res.status(401).json({ err: "Review already downvoted" });
          } else {
            // clear upvote
            await clearVote(review, user, increase = false);

            // do downvote
            const status = await downvote(review, user);
            return res.status(200).json({ status: "Review changed to downvoted"});
          }
        } else {
          // do downvote
          const status = downvote(review, user);
          return res.status(200).json({ status: "Review downvoted"});
        }
        break;

      case "clear":
        if (isVoted(review, user)) {
          // clear vote
          const status = await clearVote(review, user, increase = !isUpvote(review, user))

          return res.status(200).json({ status: status});
        } else {
          return res.status(401).json({ err: "Review has no vote by this user" });
        }
        break;

      default:
        return res.status(401).json({ err: "Voting action in vote API is not defined" });
    }

  } catch (err) {
    console.log(err);
    res.status(400).json({ err: "Vote Review Failed" });
  }
}

exports.upvoteReview = async (req, res) => {
  try {
    // Id of requestor
    const userId = req.userData._id;
    let user = await User.findById(userId);

    const reviewId = req.body.reviewId;
    let review = await Review.findById(reviewId);

    const status = upvote(review, user);
    return res.status(200).json({ status: "Review upvoted"});
  } catch (err) {
    console.log(err);
    res.status(400).json({ err: "Upvote Review Failed" });
  }
}

exports.downvoteReview = async (req, res) => {
  try {
    // Id of requestor
    const userId = req.userData._id;
    let user = await User.findById(userId);

    const reviewId = req.body.reviewId;
    let review = await Review.findById(reviewId);

    const status = downvote(review, user);
    return res.status(200).json({ status: "Review downvoted"});
  } catch (err) {
    console.log(err);
    res.status(400).json({ err: "Downvote Review Failed" });
  }
}

exports.checkVoted = async (req, res) => {
  try {
    // Id of requestor
    const userId = req.userData._id;
    let user = await User.findById(userId);

    const reviewId = req.body.reviewId;
    let review = await Review.findById(reviewId);

    if (isVoted(review, user)) {
      if (isUpvote(review, user)) {
        res.status(200).json({ res: 'upvote' });
      } else {
        res.status(200).json({ res: 'downvote' });
      }
    } else {
      res.status(200).json({ res: 'no vote' });
    };

  } catch (err) {
    console.log(err);
    res.status(400).json({ err: "Check Voted Failed" });
  }
}

exports.getVotes = async (req, res) => {
  try {
    const reviewId = req.body.reviewId;
    let review = await Review.findById(reviewId);

    res.status(200).json({ votes: review.votes });
  } catch (err) {
    console.log(err);
    res.status(400).json({ err: "Get Review Votes Failed" });
  }
}

function isVoted(review, user) {
  const reviewId = review._id.toString();

  for (i in user.voted) {
    if (reviewId == user.voted[i].id) {
      return true;
    }
  }

  return false;
}

function isUpvote(review, user) {
  const reviewId = review._id.toString();

  for (i in user.voted) {
    if (reviewId == user.voted[i].id) {
      return user.voted[i].isUpvote;
    }
  }
  
  return "Cannot find vote";
}

async function upvote(review, user) {
  const reviewId = review._id.toString();
  const userId = user._id.toString();

  const status = await User.findByIdAndUpdate(userId, {
      $push: {
        voted: { id: reviewId, isUpvote: true }, 
      } 
  });

  // update counter on review
  await changeNumVote(+1, reviewId);

  // credit system
  await addCredited(review, user, change = CREDITS_AWARDED_AUTHOR_UPVOTE);

  return status;
}

async function downvote(review, user) {
  const reviewId = review._id.toString();
  const userId = user._id.toString();
  
  const status = await User.findByIdAndUpdate(userId, {
      $push: {
        voted: { id: reviewId, isUpvote: false }, 
      } 
  });

  // update counter on review
  await changeNumVote(-1, reviewId);
  
  return status;
}

async function clearVote(review, user, increase) {
  const reviewId = review._id.toString();
  const userId = user._id.toString();
  
  const status = await User.findByIdAndUpdate(userId, {
        $pull: {
          voted: { id: reviewId },
      },
  })

  if (increase) {
    // update counter on review
    await changeNumVote(1, reviewId);
  } else {
    await changeNumVote(-1, reviewId);
  }

  return status;
}

async function changeNumVote(change, reviewId) {
  const status = await Review.findByIdAndUpdate(reviewId, {
        $inc: {
          votes: change
      },
  })
  return status;
}

async function addCredited(review, user, credits = 0) {
  if (!(checkCredited(review, user))  // not credited before
      && user._id != review._id) {        // not your own review

    review.creditedVote = [user._id, ...review.creditedVote];

    let authorId = review.userId;
    let author = await User.findById(authorId);

    await changeCredits(author, credits);
  }
  return await review.save();
}

// Used only for debugging/dev for now
async function removeCredited(review, user) { 
  review.creditedVote = review.creditedVote.filter(x => x != user._id);
  return await review.save();
}

function checkCredited(review, user) {
  return review.creditedVote.includes(user._id);
}

async function changeCredits(user, change) {
  if (user.credits + change < 0) {
    return "Cannot change, credits will be negative"
  }
  user.credits += change;
  return await user.save();
}
