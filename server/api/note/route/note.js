const express = require("express");
const router = express.Router();
const auth = require("../../../config/auth");
const noteController = require("../controller/noteController");

router.post('/create', auth, noteController.createNote);
router.post('/read', auth, noteController.readNote);
router.post('/update', auth, noteController.updateNote);
router.post('/delete', auth, noteController.deleteNote);
router.post('/publish', auth, noteController.publishNote);
router.post('/search', auth, noteController.searchNote);

module.exports = router;