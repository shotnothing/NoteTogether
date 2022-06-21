const Note = require("../model/Note");
const User = require("../../user/model/User");

exports.purchaseNote = async (req, res) => {
  try {
    // Note to be read
    const noteId = req.body.noteId;
    let note = await Note.findById(noteId);

    // Id of the requestor
    const userId = req.userData._id;
    let user = await User.findById(userId);

    // Check if user previously purchased note before
    if (user.purchased.includes(noteId)) {
      return res.status(401).json({ err: "Already purchased" });
    }

    // Check if user owns note
    if (note.userId == userId) {
      return res.status(401).json({ err: "No need to purchase your own note" });
    }

    // Fetch price
    let cost = 3; // STUMP
    if (user.credits < cost) {
      return res.status(401).json({ err: "You cannot afford this purchase" });
    }

    // update user
    user.purchased = [noteId, ...user.purchased];
    user.credits -= cost;
    await user.save();

    res.status(200).json({ note: savedNote });
  } catch (err) {
    console.log(err);
    res.status(400).json({ err: err });
  }
}

exports.checkPurchase = async (req, res) => {
  try {
    // Id of the requestor
    const userId = req.userData._id;
    let user = await User.findById(userId);

    let purchased = user.purchased.includes(req.body.noteId);

    res.status(200).json({ purchased: purchased });
  } catch (err) {
    console.log(err);
    res.status(400).json({ err: err });
  }
}
