const Note = require("../model/Note");
const User = require("../../user/model/User");
const Review = require("../../review/model/Review");

const purchaseController = require("./purchaseController");

const PER_PAGE = 10;
const PREVIEW_LEN_FRAC = 0.7;
const MAX_PREVIEW_LEN = 25;
const MAX_TITLE_LENGTH = 50;
const CREDITS_AWARDED_AUTHOR_PUBLISH = 1;

const GOLD_TIER = 750;
const SILVER_TIER = 400;
const BRONZE_TIER = 200;

const GOLD_PRICE = 4;
const SILVER_PRICE = 2;
const BRONZE_PRICE = 1;

exports.createNote = async (req, res) => {
  try {
    // Id of requestor
    const userId = req.userData._id;

    // check title length
    if (req.body.title.length > MAX_TITLE_LENGTH) {
      return res.status(406).json({ err: "Title is too long" });
    }

    const content = req.body.content.split('\n');
    const isCheatsheet = req.body.isCheatsheet || false;

    // Create note (assume first that its not a fork)
    var note = new Note({
      title: req.body.title,
      content: content,
      length: content.length,
      userId: userId,
      isCheatsheet: isCheatsheet
    });

    if (!!req.body.forkOf) {

      // Find parent note
      let noteParent = await Note.findById(req.body.forkOf);
      if (!noteParent) {
        return res.status(409).json({
          userId: userId,
          err: "Can't fork, no such parent note exists!"
        });        
      }

      let noteParentContent = await resolveFork(noteParent);

      var out = myers(
        noteParentContent,
        req.body.content.split('\n'))

      note = new Note({
        title: req.body.title,
        content: out,
        userId: userId,
        length: req.body.content.length,
        forkOf: req.body.forkOf,
        isCheatsheet: isCheatsheet
      });
    }

    // Adds new note to user's collection
    let savedNote = await note.save();
    let user = await User.findById(userId);
    // user.notes.push(savedNote._id);
    const status = await User.findByIdAndUpdate(userId, {
      $addToSet: {
        notes: savedNote._id, 
      } 
    });
    await user.save();

    res.status(201).json({ note: savedNote });
  } catch (err) {
    console.log(err);
    res.status(400).json({ err: "Note Creation Failed" });
  }
}

exports.readNote = async (req, res) => {
  try {
    // Note to be read
    const noteId = req.body.noteId;
    let note = await Note.findById(noteId).populate("userId", "username");

    // Id of the requestor
    const userId = req.userData._id;
    let user = await User.findById(userId);

    // Id of the author
    const authorId = note.userId._id;

    // Can access the note if you created it, or if it's published
    if ((!note.isPublished || note.isDeleted) && authorId != userId) {
      return res.status(401).json({ err: "Not authorised/published" });
    }

    let content = await resolveFork(note);

    let baseNoteInformation = await getBaseNoteInformation(note);
    baseNoteInformation["username"] = note.userId.username;
    let additionalInformation = await getAdditionalInformation(note, user);
    baseNoteInformation["isFavourited"] = additionalInformation.isFavourited;
    baseNoteInformation["isLocked"] = additionalInformation.isLocked;
    baseNoteInformation["voteStatus"] = additionalInformation.voteStatus;

    baseNoteInformation["reviews"] = [];
    for (reviewId of note.reviews.reverse()) {
      let review = await Review.findById(reviewId.toString())
        .populate("userId", "username")
        .select("title content username dateCreated votes")
        .lean();
      review["voteStatus"] = await getVoteInformation(review, user);
      baseNoteInformation.reviews.push(review);
    }

    // Must purchase note if locked
    if (additionalInformation.isLocked) {
      baseNoteInformation["err"] = "Need to purchase";
      baseNoteInformation["preview"] = getPreviewContent(content).join("\n");
      for ([key, val] of Object.entries(additionalInformation)) {
        baseNoteInformation[key] = val;
      }
      return res.status(402).json(baseNoteInformation);
    }

    baseNoteInformation["content"] = content.join("\n");

    if (!user.purchased.includes(noteId)) {
      // user.purchased.push(noteId);
      const status = await User.findByIdAndUpdate(userId, {
        $addToSet: {
          purchased: noteId, 
        } 
      });
    }

    const userStatus = await user.save();
    for ([key, val] of Object.entries(additionalInformation)) {
      baseNoteInformation[key] = val;
    }

    return res.status(200).json(baseNoteInformation);
  } catch (err) {
    console.log(err);
    res.status(400).json({ err: "Note Read Failed" });
  }
}

exports.updateNote = async (req, res) => {
  try {
    // Note to be saved
    const noteId = req.body.noteId;
    let note = await Note.findById(noteId);

    // Id of the requestor
    const userId = req.userData._id;
    // Id of the note creator
    const noteCreatorId = note.userId;
    // Cannot update a note that does not belong to you
    if (noteCreatorId != userId) {
      return res.status(405).json({ err: "Not authorised!" });
    }
    
    // Cannot update a published or deleted note
    if (note.isPublished || note.isDeleted) {
      return res.status(405).json({
        note: note,
        err: "Cannot update a published or deleted note!"
      });
    }

    // Replaces the content
    if (!!note.forkOf) {
      note.content = myers(
        await resolveFork(note), 
        req.body.content.split('\n'));
    } else {
      note.content = req.body.content;
    }
    note.length = req.body.content.length;
    note.title = req.body.title;
    note.dateLastUpdated = Date.now();
    await note.save();

    res.status(200).json({ note: note });
  } catch (err) {
    console.log(err)
    res.status(400).json({ err: "Note Update Failed" });
  }
}

exports.deleteNote = async (req, res) => {
  try {
    // Note to be deleted
    const noteId = req.body.noteId;
    let note = await Note.findById(noteId);

    // Cannot update a note that does not belong to you
    if (note.userId != req.userData._id) {
      return res.status(405).json({ err: "Not authorised!" });
    }

    // Cannot delete a deleted note
    if (note.isDeleted) {
      return res.status(405).json({
        note: note,
        err: "Note has already been deleted!"
      });
    }

    // Updates the flags for the note
    note.isDeleted = true;
    note.isPublished = false;
    const savedNote = await note.save();

    // Delete note from the user's perspective
    const userId = req.userData._id;
    let user = await User.findById(userId);
    user.notes.splice(user.notes.indexOf(noteId), 1);
    await user.save();

    res.status(200).json({ note: savedNote });
  } catch (err) {
    res.status(400).json({ err: "Note Delete Failed" });
  }
}

exports.publishNote = async (req, res) => {
  try {
    // Note to be published
    const noteId = req.body.noteId;
    let note = await Note.findById(noteId);

    // Id of the requestor
    const userId = req.userData._id;
    let user = await User.findById(userId);
    // Id of the note creator
    const noteCreatorId = note.userId;

    // Cannot publish note that does not belong to you
    if (noteCreatorId != userId) {
      return res.status(405).json({ err: "Not authorised!" });
    }

    // Cannot published note that has already been published
    if (note.isPublished) {
      return res.status(405).json({
        note: note,
        err: "Note already published"
      });
    }

    // Updates note entries
    note.isPublished = true;
    note.datePublished = Date.now();
    await note.save();

    // Create new private note that can still be edited
    // The private note will increment the version number of the note
    let newTitle = "";
    const lastLetter = note.title.charAt(note.title.length-1);
    const secondLastLetter = note.title.charAt(note.title.length-2);
    if (secondLastLetter == "V") {
      newTitle = note.title.slice(0, -1) + (parseInt(lastLetter) + 1).toString();
    } else {
      newTitle = note.title + " V2";
    }
    const newPrivateNote = new Note({
      title: newTitle,
      userId: noteCreatorId,
      content: note.content,
      length: note.content.length,
      forkOf: note._id.toString()
    });

    // Adds new note to user's collection
    const savedNote = await newPrivateNote.save();
    // user.notes.push(newPrivateNote._id);
    const status = await User.findByIdAndUpdate(userId, {
      $inc: {
        credits: CREDITS_AWARDED_AUTHOR_PUBLISH, 
      },
      $addToSet: {
        notes: newPrivateNote._id,
      }
    });
    await user.save();

    res.status(201).json({ note: savedNote });
  } catch (err) {
    console.log(err);
    res.status(400).json({ err: "Note Publish Failed" });
  }
}

exports.searchNote = async (req, res) => {
  try {
    // Id of requestor
    const userId = req.userData._id;
    let user = await User.findById(userId);

    const notes = await Note
      .find({
        title: { $regex: new RegExp(req.body.searchTerm, "i") },
        isPublished: true,
        isDeleted: false
      })
      .sort({ votes: -1 })
      .skip(PER_PAGE*(req.body.page-1))
      .limit(PER_PAGE+1)
      .populate("userId", "username")
      .select("_id title userId dateLastUpdated username votes favourites reviewCount forkOf length isCheatsheet")
      .lean();

    const notesCount = await Note.count({
        title: { $regex: new RegExp(req.body.searchTerm, "i") },
        isPublished: true,
        isDeleted: false
      })
    
    const pageCount = Math.ceil(notesCount / PER_PAGE);
    
    const hasNextPage = notes.length > PER_PAGE;
    if (hasNextPage) {
      notes.pop();
    };
    const hasPreviousPage = req.body.page > 1;

    for (let i = 0; i < notes.length; i++) {
      // console.log("start: " + new Date().getTime());
      let note = notes[i];
      const tierPrice = getTier(note);
      // console.log("getTier: " + new Date().getTime());
      const additionalInformation = await getAdditionalInformation(note, user);
      // console.log("getAdditional: " + new Date().getTime());
      note["tier"] = tierPrice.tier;
      note["price"] = tierPrice.price;
      note["metric"] = tierPrice.metric;
      note["username"] = await getUsernameChain(note);
      console.log("usernameChain: " + new Date().getTime());
      note["isFavourited"] = additionalInformation.isFavourited;
      note["isLocked"] = additionalInformation.isLocked;
      note["voteStatus"] = additionalInformation.voteStatus;
    }

    res.status(200).json({
      hasPreviousPage: hasPreviousPage,
      hasNextPage: hasNextPage,
      searchResults: notes,
      pageCount: pageCount
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({ err: "Note Search Failed" });
  }
}

async function isLocked(noteId, userId) {
  const note = await Note.findById(noteId);
  const user = await User.findById(userId);
  const tierPrice = getTier(note);
  const tier = tierPrice.tier;
  // The note is locked if
  return tier != "free"                      // its not free 
    && note.userId != userId                      // you dont own the note
    && !user.purchased.includes(noteId);           // you have not purchased it before
    // && note.content.length > PREVIEW_LEN;         // the note is short enough
}

async function getBaseNoteInformation(note) {
  const tierPrice = getTier(note);
  const toReturn = {
    noteId: note._id,
    title: note.title,
    dateLastUpdated: note.dateLastUpdated,
    dateCreated: note.dateCreated,
    votes: note.votes,
    favourites: note.favourites,
    tier: tierPrice.tier,
    price: tierPrice.price,
    metric: tierPrice.metric,
    reviewCount: note.reviewCount,
    isCheatsheet: note.isCheatsheet
  };
  toReturn["username"] = await getUsernameChain(note);

  return toReturn;
}

async function getUsernameChain(note) {
  // let currUser = await User.findById(note.userId);
  // let username = currUser.username;
  // let currNote = note;
  // while (!!currNote.forkOf) {
  //   currNote = await Note.findById(currNote.forkOf);
  //   currUser = await User.findById(currNote.userId);
  //   username += ", " + currUser.username;
  // }
  // return username;
  return note.userId.username;
}

exports.getUsernameChain = getUsernameChain;

async function getAdditionalInformation(note, user) {
  let additionalInformation = {};
  const noteId = note._id.toString();
  additionalInformation["isFavourited"] = user.favourited.includes(note._id);
  additionalInformation["isLocked"] = await isLocked(noteId, user._id.toString());
  additionalInformation["voteStatus"] = await getVoteInformation(note, user);

  return additionalInformation;
}

async function getVoteInformation(item, user) {
  let voteStatus = "no vote"
  for (vote of user.voted) {
    if (vote.id == item._id.toString()) {
      voteStatus = vote.isUpvote ? "upvote" : "downvote";
      break;
    }
  }
  return voteStatus;
}

function myers(o, n) {
  var ns = new Object();
  var os = new Object();
  
  //deep copies
  o = o.slice(); 
  n = n.slice();
  
  var diff = [];
  
  for (var i = 0; i < n.length; i++) {
    if (ns[ n[i] ] == null)
      ns[ n[i] ] = { rows: new Array(), o: null };
    ns[ n[i] ].rows.push([i]);
  }
  
  for (var i = 0; i < o.length; i++) {
    if (os[ o[i] ] == null)
      os[ o[i] ] = { rows: new Array(), n: null };
    os[ o[i] ].rows.push([i]);
  }
  
  for (var i in ns) {
    if (ns[i].rows.length == 1 && typeof(os[i]) != "undefined" && os[i].rows.length == 1) {
      n[ ns[i].rows[0] ] = os[i].rows[0];
      o[ os[i].rows[0] ] = ns[i].rows[0];
    }
  }
  
  for (var i = 0; i < n.length - 1; i++) {
    if (n[i].text != null && n[i+1].text == null && n[i].row + 1 < o.length && o[ n[i].row + 1 ].text == null && 
         n[i+1] == o[ n[i].row + 1 ]) {
      n[i+1] = n[i].row + 1 ;
      o[n[i].row+1] =  i + 1 ;
    }
  }
  
  for (var i = n.length - 1; i > 0; i--) {
    if (n[i].text != null && n[i-1].text == null && n[i].row > 0 && o[ n[i].row - 1 ].text == null && 
         n[i-1] == o[ n[i].row - 1 ] ) {
      n[i-1] =  n[i].row - 1 ;
      o[n[i].row-1] = i - 1 ;
    }
  }
  
  for (var i in o) {
      if (!Array.isArray(o[i])) {
          diff.push('-' + i)
          diff.push('')
      }
  }
  
  for (var i in n) {
      if (!Array.isArray(n[i])) {
          diff.push('+' + i)
          diff.push(n[i].slice(0, n.length - 1))
      }
  }
  
  return diff;
}

function unmyers(n, diff) {
    var o = n.slice(); //deep copy
  
    var shift = 0;
    for (i = 0; i < diff.length; i+=2) {
        var op = diff[i][0];
        var addr = parseInt(diff[i].slice(1));
        
        if (op == '-') {
            o.splice(addr + shift, 1)
            shift -= 1;
        } else if (op == '+') {
            o.splice(addr, 0, diff[i + 1]) + "\n"
        }
    }
    
    return o;
}

async function resolveFork(note) {
  if (!!note.forkOf) {
    var parent = await Note.findById(note.forkOf);
    return unmyers(await resolveFork(parent), note.content)
  }
  return note.content;
}

exports.resolveFork = resolveFork;

function getTier(note) {

  // If null, set to 0 -> graceful failure
  const votes = note.votes != null ? note.votes : 0; 
  const favourites = note.favourites != null ? note.favourites : 0;

  const metric = votes + (2 * favourites);
  
  if (metric < BRONZE_TIER) {
    return {
      tier: "free",
      price: 0,
      metric: metric
    };
  } else if (metric < SILVER_TIER) {
    return {
      tier: "bronze",
      price: BRONZE_PRICE,
      metric: metric
    };
  } else if (metric < GOLD_TIER) {
    return {
      tier: "silver",
      price: SILVER_PRICE,
      metric: metric
    };
  } else {
    return {
      tier: "gold",
      price: GOLD_PRICE,
      metric: metric
    };
  }
}

function getPreviewContent(content) {
  return content.slice(0, Math.min(content.length ** PREVIEW_LEN_FRAC, MAX_PREVIEW_LEN));
}
