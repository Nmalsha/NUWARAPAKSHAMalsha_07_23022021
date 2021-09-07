const express = require("express");
const postCtrl = require("../controller/post");
const router = express.Router();
const multer = require("../middleware/multer-config");

router.post("/post", multer, postCtrl.createPost);
router.get("/post", multer, postCtrl.getAllPost);
//router.get("/onepos", multer, postCtrl.getOnePost);
router.get("/postsuser", multer, postCtrl.getAllPostsForOneUser);
router.put("/post", multer, postCtrl.editPost);
module.exports = router;
