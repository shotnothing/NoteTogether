const Note = require("../model/Note");
const User = require("../../user/model/User");

exports.favourite = async (req, res) => {
  try {
    // Note to be read
    const noteId = req.body.noteId;
    let note = await Note.findById(noteId);

    // Id of the requestor
    const userId = req.userData._id;
    let user = await User.findById(userId);

    let status = "No Status";
    let action = req.body.action;
    switch (action) {
      case "favourite":
        // Check if user previously favourited note before
        if (user.favourited.includes(noteId)) {
          return res.status(401).json({ err: "Already favourited" });
        }
        await addFavourite(noteId, user);
        status = "favourited";
        break;

      case "clear":
        // Check if user has not favourited note
        if (!user.favourited.includes(noteId)) {
          return res.status(401).json({ err: "Not favourited, nothing to clear" });
        }
        await removeFavourite(noteId, user);
        status = "unfavourited";
        break;

      default:
        if (user.favourited.includes(noteId)) { // if favourited, unfavourite
          await removeFavourite(noteId, user);
          status = "unfavourited";
        } else { // if not favourited, favourite note
          await addFavourite(noteId, user);
          status = "favourited";
        }
        break;
    }

    res.status(200).json({ status: status });
  } catch (err) {
    console.log(err);
    res.status(400).json({ err: "Favourite Operation Failed" });
  }
}

exports.checkFavourited = async (req, res) => {
  try {
    // Note to be read
    const noteId = req.body.noteId;
    let note = await Note.findById(noteId);

    // Id of the requestor
    const userId = req.userData._id;
    let user = await User.findById(userId);

    res.status(200).json({ favourited: user.favourited.includes(noteId) });
  } catch (err) {
    console.log(err);
    res.status(400).json({ err: "Check Favourite Failed" });
  }
}

async function addFavourite(noteId, user) {
  user.favourited = [noteId, ...user.favourited];
  const note = await Note.findById(noteId);
  note.creditedVFavourite = [user._id, ...note.creditedFavourite];
  await note.save();
  const status = await user.save();
  return status;
}

async function removeFavourite(noteId, user) {
  user.favourited = user.favourited.filter(x => x != noteId);
  const status = await user.save();
  return status;
}