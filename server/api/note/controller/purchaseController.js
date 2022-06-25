const Note = require("../model/Note");
const User = require("../../user/model/User");

TIER_BRONZE_PERCENTILE = 0.3;
TIER_SILVER_PERCENTILE = 0.2;
TIER_GOLD_PERCENTILE = 0.1;

TIER_BRONZE_FIXED = 20;
TIER_SILVER_FIXED = 50;
TIER_GOLD_FIXED = 100;

TIER_BRONZE_COST = 1;
TIER_SILVER_COST = 2;
TIER_GOLD_COST = 4;

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
    let cost = 0;

    switch(await this.getTier(note)) {
      case 'gold': 
        cost = TIER_GOLD_COST;
        break;
      case 'silver':
        cost = TIER_SILVER_COST;
        break;
      case 'bronze':
        cost = TIER_BRONZE_COST;
        break;
      default:
        break;
    }
    
    if (user.credits < cost) {
      return res.status(405).json({ err: "You cannot afford this purchase" });
    }

    // update user
    user.purchased = [noteId, ...user.purchased];
    user.credits -= cost;
    const savedNote = await user.save();

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

exports.getTierAPI = async (req, res) => {
  try {
    console.log(req.body.noteId);
    const note = await Note.findById(req.body.noteId);
    console.log(note);
    const tier = await this.getTier(note);
    console.log(tier);
    let price = 0;
    if (tier == "gold") {
      price = TIER_GOLD_COST;
    } else if (tier == "silver") {
      price = TIER_SILVER_COST;
    } else if (tier == "bronze") {
      price = TIER_BRONZE_COST;
    }
    res.status(200).json({ tier: tier, price: price });
  } catch (err) {
    console.log(err);
    res.status(400).json({ err: err });
  }
}

exports.getTier = async (note) => {
  // gt count may be slow, to replace when scaling up
  // let gt = await Note.find({ votes: {$gt: note.votes} }).count();
  // let total = await Note.count();
  // let metric = gt / total;

  // if (metric <= TIER_GOLD_PERCENTILE) {
  //   return 'gold';
  // } else if (metric <= TIER_SILVER_PERCENTILE) {
  //   return 'silver';
  // } else if (metric <= TIER_BRONZE_PERCENTILE) {
  //   return 'bronze';
  // }

  let metric = note.votes;

  if (metric >= TIER_GOLD_FIXED) {
    return 'gold';
  } else if (metric >= TIER_SILVER_FIXED) {
    return 'silver';
  } else if (metric >= TIER_BRONZE_FIXED) {
    return 'bronze';
  }
  return 'none';
}
