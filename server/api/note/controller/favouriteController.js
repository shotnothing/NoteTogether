const Note = require("../model/Note");
const User = require("../../user/model/User");

exports.favourite = async (req, res) => {
  try {


    res.status(200).json({ note: "hi" });
  } catch (err) {
    console.log(err);
    res.status(400).json({ err: err });
  }
}
