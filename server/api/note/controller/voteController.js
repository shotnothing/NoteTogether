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
            res.status(401).json({ err: "Note already upvoted" });
          } else {
            // change downvote to upvote
            res.status(200).json({ status: 'WIP down2up'});
          }
        } else {
          // do upvote
          res.status(200).json({ status: 'WIP up'});
        }

        // await User.updateOne(
        //   { _id: userId },
        //   {
        //     $push: {
        //       'voted': { id: noteId, isUpvote: true }, 
        //     } 
        //   });
        break;

      case "downvote":
        if (isVoted(noteId, user)) {
          if (!isUpvote(noteId, user)) {
            res.status(401).json({ err: "Note already downvoted" });
          } else {
            // change upvote to downvote
            res.status(200).json({ status: 'WIP up2down'});
          }
        } else {
          // do downvote
          res.status(200).json({ status: 'WIP down'});
        }
        break;

      case "clear":
        if (isVoted(noteId, user)) {
          const status = await User.findByIdAndUpdate(userId, {
                $pull: {
                  voted: { id: noteId },
              },
          })
          res.status(200).json({ status: status});
        } else {
          res.status(401).json({ err: "Note has no vote by this user" });
        }
        break;

      default:
        res.status(401).json({ err: "Voting action in vote API is not defined" });
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
    
    let voted = isVoted(noteId, user);

    res.status(200).json({ res: voted });
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