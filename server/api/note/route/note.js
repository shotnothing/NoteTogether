const express = require("express");
const router = express.Router();
const auth = require("../../../config/auth");
const noteController = require("../controller/noteController");
const voteController = require("../controller/voteController");

router.post('/create', auth, noteController.createNote);
router.post('/read', auth, noteController.readNote);
router.post('/update', auth, noteController.updateNote);
router.post('/delete', auth, noteController.deleteNote);
router.post('/publish', auth, noteController.publishNote);
router.post('/search', auth, noteController.searchNote);

router.post('/vote', auth, voteController.voteNote);
router.post('/isVoted', auth, voteController.isNoteVoted);

module.exports = router;