const express = require("express");
const router = express.Router();
const auth = require("../../../config/auth");
const reviewController = require("../controller/reviewController");
const voteController = require("../controller/voteController");

router.post('/create', auth, reviewController.createReview);
router.post('/read', auth, reviewController.readReview);
router.post('/update', auth, reviewController.updateReview);
router.post('/delete', auth, reviewController.deleteReview);

router.post('/vote', auth, voteController.voteReview);
router.post('/upvote', auth, voteController.upvoteReview);
router.post('/downvote', auth, voteController.downvoteReview);
router.post('/checkVoted', auth, voteController.checkVoted);
router.post('/getVotes', auth, voteController.getVotes);

module.exports = router;