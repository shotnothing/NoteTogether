const Note = require("../model/Note");
const User = require("../../user/model/User");

const purchaseController = require("./purchaseController");

const PER_PAGE = 5;
const PREVIEW_LEN = 5;
const MAX_TITLE_LENGTH = 32;

exports.createNote = async (req, res) => {
  try {
    // Id of requestor
    const userId = req.userData._id;
    
    // Checks whether note of the same title has been created by the user
    const noteSearch = await Note.find({
      title: req.body.title,
      userId: userId,
      isDeleted: false
    });

    // User is not allowed to create two notes of the same name
    // if (noteSearch.length >= 1) {
    //   return res.status(409).json({
    //     note: noteSearch[0],
    //     err: "You have already created a note with this name!"
    //   });
    // }

    // check title length
    if (req.body.title.length > MAX_TITLE_LENGTH) {
      return res.status(401).json({ err: "Title is too long" });
    }

    // Create note (assume first that its not a fork)
    var note = new Note({
      title: req.body.title,
      content: req.body.content.split('\n'),
      userId: userId
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
        forkOf: req.body.forkOf
      });
    }

    // Adds new note to user's collection
    let savedNote = await note.save();
    let user = await User.findById(userId);
    user.notes = [note._id, ...user.notes];
    await user.save();

    res.status(200).json({ note: savedNote });
  } catch (err) {
    console.log(err);
    res.status(400).json({ err: err });
  }
}

exports.readNote = async (req, res) => {
  try {
    // Note to be read
    const noteId = req.body.noteId;
    let note = await Note.findById(noteId);

    // Id of the requestor
    const userId = req.userData._id;

    // Id of the creator of the note
    const authorId = note.userId;
    let user = await User.findById(userId);
    let author = await User.findById(authorId);
    const username = author.username;

    // Can access the note if you created it, or if it's published
    if (!note.isPublished && authorId != userId) {
      return res.status(401).json({ err: "Not authorised/published" });
    }

    let content = await resolveFork(note)

    // Must purchase note if
    if (purchaseController.getTier(note) != 'none'  // its not free 
      && authorId != userId                         // you dont own the note
      && !user.purchased.includes(noteId)           // you have not purchased it before
      && content.length > PREVIEW_LEN               // no need to pay for short notes
    ) {
      return res.status(402).json({ 
        err: "Need to purchase",
        preview: content.slice(0, PREVIEW_LEN).join(),
        title: note.title,
        username: username,
        dateLastUpdated: note.dateLastUpdated,
        dateCreated: note.dateCreated,
        votes: note.votes,
        noteId: noteId
      });
    }

    res.status(200).json({
      title: note.title,
      content: (await resolveFork(note)).join(),
      raw_content: note.content,
      username: username,
      dateLastUpdated: note.dateLastUpdated,
      dateCreated: note.dateCreated,
      votes: note.votes,
      noteId: noteId,
      isPublished: note.isPublished,
      isDeleted: note.isDeleted,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({ err: err });
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
      return res.status(401).json({ err: "Not authorised!" });
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
    note.title = req.body.title;
    note.dateLastUpdated = Date.now();
    await note.save();

    res.status(200).json({ note: note });
  } catch (err) {
    console.log(err)
    res.status(400).json({ err: err });
  }
}

exports.deleteNote = async (req, res) => {
  try {
    // Note to be deleted
    const noteId = req.body.noteId;
    let note = await Note.findById(noteId);

    // Cannot update a note that does not belong to you
    if (note.userId != req.userData._id) {
      return res.status(401).json({ err: "Not authorised!" });
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
    res.status(400).json({ err: err });
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
      return res.status(401).json({ err: "Not authorised!" });
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
    const newPrivateNote = new Note({
      title: note.title,
      userId: noteCreatorId,
      content: note.content,
    });

    // Adds new note to user's collection
    const savedNote = await newPrivateNote.save();
    user.notes = [newPrivateNote._id, ...user.notes];
    await user.save();

    res.status(200).json({ note: savedNote });
  } catch (err) {
    res.status(400).json({ err: err });
  }
}

exports.searchNote = async (req, res) => {
  try {
    const notes = await Note
      .find({
        title: { $regex: new RegExp(req.body.searchTerm, "i") },
        isPublished: true,
        isDeleted: false
      })
      .sort({ votes: -1 })
      .skip(PER_PAGE*(req.body.page-1))
      .limit(PER_PAGE)
      .populate("userId", "username")
      .select("_id title userId dateLastUpdated username votes favourites");

    res.status(200).json({ searchResults: notes });
  } catch (err) {
    res.status(400).json({ err: err });
  }
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
          diff.push(n[i])
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
            o.splice(addr, 0, diff[i + 1])
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
