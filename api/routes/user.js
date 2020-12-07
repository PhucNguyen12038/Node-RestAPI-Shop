const express = require("express");
const router = express.Router();
const UserController = require('../controller/user');

router.post("/signup", UserController.user_signup);

router.delete("/:userId", UserController.user_delete_user_by_id);

router.post("/login", UserController.user_login);
module.exports = router;