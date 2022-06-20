const express = require("express");
const router = express.Router();
const auth = require("../../../config/auth");
const reviewController = require("../controller/reviewController");

router.post('/create', auth, reviewController.createReview);
router.post('/read', auth, reviewController.readReview);
router.post('/update', auth, reviewController.updateReview);
router.post('/delete', auth, reviewController.deleteReview);

module.exports = router;