const Note = require("../model/Note");
const User = require("../../user/model/User");

exports.voteNote = async (req, res) => {
  try {
    // Id of requestor
    const userId = req.userData._id;
    let user = await User.findById(userId);
    const noteId = req.body.noteId;

    switch (req.body.action) {

      case "upvote":
        if (isVoted(noteId, user)) {
          if (isUpvote(noteId, user)) {
            return res.status(401).json({ err: "Note already upvoted" });
          } else {
            // clear downvote
            await clearVote(noteId, userId, increase = true);

            // do upvote
            const status = await upvote(noteId, userId);
            return res.status(200).json({ status: "Note changed to upvoted"});
          }
        } else {
          // do upvote
          const status = upvote(noteId, userId);
          return res.status(200).json({ status: "Note upvoted"});
        }

        break;

      case "downvote":
        if (isVoted(noteId, user)) {
          if (!isUpvote(noteId, user)) {
            return res.status(401).json({ err: "Note already downvoted" });
          } else {
            // clear upvote
            await clearVote(noteId, userId, increase = false);

            // do downvote
            const status = await downvote(noteId, userId);
            return res.status(200).json({ status: "Note changed to downvoted"});
          }
        } else {
          // do downvote
          const status = downvote(noteId, userId);
          return res.status(200).json({ status: "Note downvoted"});
        }
        break;

      case "clear":
        if (isVoted(noteId, user)) {
          // clear vote
          const status = await clearVote(noteId, userId, increase = !isUpvote(noteId, user))

          return res.status(200).json({ status: status});
        } else {
          return res.status(401).json({ err: "Note has no vote by this user" });
        }
        break;

      default:
        return res.status(401).json({ err: "Voting action in vote API is not defined" });
    }

  } catch (err) {
    console.log(err);
    res.status(400).json({ err: err });
  }
}

exports.checkVoted = async (req, res) => {
  try {
    // Id of requestor
    const userId = req.userData._id;
    let user = await User.findById(userId);

    const noteId = req.body.noteId;
    if (isVoted(noteId, user)) {
      if (isUpvote(noteId, user)) {
        res.status(200).json({ res: 'upvote' });
      } else {
        res.status(200).json({ res: 'downvote' });
      }
    } else {
      res.status(200).json({ res: 'no vote' });
    };

  } catch (err) {
    console.log(err);
    res.status(400).json({ err: err });
  }
}

function isVoted(noteId, user) {
    for (i in user.voted) {
      if (noteId == user.voted[i].id) {
        return true;
      }
    }
    return false;
}

function isUpvote(noteId, user) {
    for (i in user.voted) {
      if (noteId == user.voted[i].id) {
        return user.voted[i].isUpvote;
      }
    }
    throw 'Cannot find note!';
    return
}

async function upvote(noteId, userId) {
  const status = await User.findByIdAndUpdate(userId, {
      $push: {
        voted: { id: noteId, isUpvote: true }, 
      } 
  });

  // update counter on note
  await changeNumVote(+1, noteId);

  return status;
}

async function downvote(noteId, userId) {
  const status = await User.findByIdAndUpdate(userId, {
      $push: {
        voted: { id: noteId, isUpvote: false }, 
      } 
  });

  // update counter on note
  await changeNumVote(-1, noteId);
  
  return status;
}

async function clearVote(noteId, userId, increase) {
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
  console.log(" BREAKPOINT ")
  console.log(noteId)
  const status = await Note.findByIdAndUpdate(noteId, {
        $inc: {
          votes: change
      },
  })
  return status;
}