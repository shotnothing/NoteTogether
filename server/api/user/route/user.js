const express = require("express");
const router = express.Router();
const auth = require("../../../config/auth");
const userController = require("../controller/userController");

router.post("/register", userController.registerNewUser);
router.post("/login", userController.loginUser);
router.post("/me", auth, userController.getUserDetails);

router.post("/notes/created", auth, userController.createdNotes);
router.post("/notes/published", auth, userController.publishedNotes);
router.post("/notes/favourited", auth, userController.favouritedNotes);
router.post("/notes/purchased", auth, userController.purchasedNotes);

router.post("/best", auth, userController.bestUsers);

module.exports = router;
