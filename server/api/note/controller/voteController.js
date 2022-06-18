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

        await User.updateOne(
          { _id: userId },
          {
            $push: {
              'voted': { id: noteId, isUpvote: true }, 
            } 
          });

        console.log("up")
        break;
      case "downvote":
        console.log("down")
        break;
      case "clear":
        console.log("clear")
        break;
      default:
        throw "Voting action in vote API is not defined, check client.";
    }

    res.status(200).json();
  } catch (err) {
    console.log(err);
    res.status(400).json({ err: err });
  }
}

exports.isNoteVoted = async (req, res) => {
  try {
    // Id of requestor
    const userId = req.userData._id;
    let user = await User.findById(userId);

    const noteId = req.body.noteId;

    voted = await User.find({ /*_id: userId,*/ voted: { id: noteId } })
    console.log({ /*_id: userId,*/ voted: { id: noteId } })
    

    res.status(200).json({ isNoteVoted: voted });
  } catch (err) {
    console.log(err);
    res.status(400).json({ err: err });
  }
}