const Note = require("../model/Note");
const User = require("../../user/model/User");

CREDITS_AWARDED_AUTHOR_UPVOTE = 1;

exports.voteNote = async (req, res) => {
  try {
    // Id of requestor
    const userId = req.userData._id;
    let user = await User.findById(userId);

    const noteId = req.body.noteId;
    let note = await Note.findById(noteId);

    switch (req.body.action) {

      case "upvote":
        if (isVoted(note, user)) {
          if (isUpvote(note, user)) {
            return res.status(409).json({ err: "Note already upvoted" });
          } else {
            // clear downvote
            await clearVote(note, user, increase = true);

            // do upvote
            const status = await upvote(note, user);
            return res.status(200).json({ status: "Note changed to upvoted"});
          }
        } else {
          // do upvote
          const status = upvote(note, user);
          return res.status(200).json({ status: "Note upvoted"});
        }

        break;

      case "downvote":
        if (isVoted(note, user)) {
          if (!isUpvote(note, user)) {
            return res.status(409).json({ err: "Note already downvoted" });
          } else {
            // clear upvote
            await clearVote(note, user, increase = false);

            // do downvote
            const status = await downvote(note, user);
            return res.status(200).json({ status: "Note changed to downvoted"});
          }
        } else {
          // do downvote
          const status = downvote(note, user);
          return res.status(200).json({ status: "Note downvoted"});
        }
        break;

      case "clear":
        if (isVoted(note, user)) {
          // clear vote
          const status = await clearVote(note, user, increase = !isUpvote(note, user))

          return res.status(200).json({ status: status});
        } else {
          return res.status(409).json({ err: "Note has no vote by this user" });
        }
        break;

      default:
        return res.status(401).json({ err: "Voting action in vote API is not defined" });
    }

  } catch (err) {
    console.log(err);
    res.status(400).json({ err: "Vote Failed" });
  }
}

exports.upvoteNote = async (req, res) => {
  try {
    // Id of requestor
    const userId = req.userData._id;
    let user = await User.findById(userId);

    const noteId = req.body.noteId;
    let note = await Note.findById(noteId);

    if (isVoted(note, user)) {
      if (isUpvote(note, user)) {
        return res.status(409).json({ err: "Note already upvoted" });
      } else {
        // clear downvote
        await clearVote(note, user, increase = true);

        // do upvote
        const status = await upvote(note, user);
        return res.status(200).json({ status: "Note changed to upvoted"});
      }
    } else {
      // do upvote
      const status = upvote(note, user);
      return res.status(200).json({ status: "Note upvoted"});
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({ err: "Upvote Failed" });
  }
}

exports.downvoteNote = async (req, res) => {
  try {
    // Id of requestor
    const userId = req.userData._id;
    let user = await User.findById(userId);

    const noteId = req.body.noteId;
    let note = await Note.findById(noteId);

    if (isVoted(note, user)) {
      if (!isUpvote(note, user)) {
        return res.status(409).json({ err: "Note already downvoted" });
      } else {
        // clear upvote
        await clearVote(note, user, increase = false);

        // do downvote
        const status = await downvote(note, user);
        return res.status(200).json({ status: "Note changed to downvoted"});
      }
    } else {
      // do downvote
      const status = downvote(note, user);
      return res.status(200).json({ status: "Note downvoted"});
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({ err: "Downvote Failed" });
  }
}

exports.checkVoted = async (req, res) => {
  try {
    // Id of requestor
    const userId = req.userData._id;
    let user = await User.findById(userId);

    const noteId = req.body.noteId;
    let note = await Note.findById(noteId);

    if (isVoted(note, user)) {
      if (isUpvote(note, user)) {
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
    const noteId = req.body.noteId;
    let note = await Note.findById(noteId);

    res.status(200).json({ votes: note.votes });
  } catch (err) {
    console.log(err);
    res.status(400).json({ err: "Get Votes Failed" });
  }
}

function isVoted(note, user) {
  const noteId = note._id.toString();

  for (i in user.voted) {
    if (noteId == user.voted[i].id) {
      return true;
    }
  }

  return false;
}

function isUpvote(note, user) {
  const noteId = note._id.toString();

  for (i in user.voted) {
    if (noteId == user.voted[i].id) {
      return user.voted[i].isUpvote;
    }
  }
  
  return "Cannot find vote";
}

async function upvote(note, user) {
  const noteId = note._id.toString();
  const userId = user._id.toString();

  const status = await User.findByIdAndUpdate(userId, {
      $push: {
        voted: { id: noteId, isUpvote: true }, 
      } 
  });

  // update counter on note
  await changeNumVote(+1, noteId);

  // credit system
  await addCredited(note, user, change = CREDITS_AWARDED_AUTHOR_UPVOTE);

  return status;
}

async function downvote(note, user) {
  const noteId = note._id.toString();
  const userId = user._id.toString();
  
  const status = await User.findByIdAndUpdate(userId, {
      $push: {
        voted: { id: noteId, isUpvote: false }, 
      } 
  });

  // update counter on note
  await changeNumVote(-1, noteId);
  
  return status;
}

async function clearVote(note, user, increase) {
  const noteId = note._id.toString();
  const userId = user._id.toString();
  
  const status = await User.findByIdAndUpdate(userId, {
        $pull: {
          voted: { id: noteId },
      },
  })

  if (increase) {
    // update counter on note
    await changeNumVote(1, noteId);
  } else {
    await changeNumVote(-1, noteId);
  }

  return status;
}

async function changeNumVote(change, noteId) {
  const status = await Note.findByIdAndUpdate(noteId, {
        $inc: {
          votes: change
      },
  })
  return status;
}

async function addCredited(note, user, credits = 0) {
  if (!(checkCredited(note, user))  // not credited before
      && user._id != note._id) {        // not your own note

    note.creditedVote = [user._id, ...note.creditedVote];

    let authorId = note.userId;
    let author = await User.findById(authorId);

    await changeCredits(author, credits);
  }
  return await note.save();
}

// Used only for debugging/dev for now
async function removeCredited(note, user) { 
  note.creditedVote = note.creditedVote.filter(x => x != user._id);
  return await note.save();
}

function checkCredited(note, user) {
  return note.creditedVote.includes(user._id);
}

async function changeCredits(user, change) {
  if (user.credits + change < 0) {
    return "Cannot change, credits will be negative"
  }
  user.credits += change;
  return await user.save();
}
