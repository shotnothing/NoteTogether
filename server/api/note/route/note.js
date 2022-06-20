const express = require("express");
const router = express.Router();
const auth = require("../../../config/auth");
const noteController = require("../controller/noteController");
const voteController = require("../controller/voteController");
const purchaseController = require("../controller/purchaseController");

router.post('/create', auth, noteController.createNote);
router.post('/read', auth, noteController.readNote);
router.post('/update', auth, noteController.updateNote);
router.post('/delete', auth, noteController.deleteNote);
router.post('/publish', auth, noteController.publishNote);
router.post('/search', auth, noteController.searchNote);

router.post('/vote', auth, voteController.voteNote);
router.post('/checkVoted', auth, voteController.checkVoted);

router.post('/purchase', auth, purchaseController.purchaseNote);
router.post('/checkPurchase', auth, purchaseController.checkPurchase);

module.exports = router;