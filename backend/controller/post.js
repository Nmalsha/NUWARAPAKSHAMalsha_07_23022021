const models = require("../models");
const jwt = require("jsonwebtoken");
const Post = models.Post;
const User = models.User;

exports.createPost = async (req, res) => {
  const postObject = req.file
    ? {
        ...JSON.parse(req.body.post),
        attachement: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : {
        ...req.body.post,
      };

  const token = req.headers.token;
  //console.log(token);
  console.log(postObject);
  jwt.verify(token, "RANDOM_TOKEN_SECRET", (err, decoded) => {
    const userId = decoded.userId;
    console.log(userId);
    const content = req.body.post;
    //console.log(content);
    if (content == null) {
      return res.status(400).json({ error: "your post is empty" });
    }

    const getUserFromDb = User.findOne({
      where: { id: userId },
    });

    if (!getUserFromDb) {
      return res
        .status(400)
        .json({ error: "Email or mot de passe incorrect ! " });
    } else {
      //console.log(getUserFromDb.data)

      const post = new Post({
        attachement: postObject.attachement,
        content: postObject.content,
        userId: postObject.userId,
      });
      post.save().then(function (post) {
        console.log(post);
        return res
          .status(201)
          .json({ message: "your post successfully created" });
      });
    }

    //get the parameters content and image
    //const postImage = req.file;
    //const content = req.body.post;
    //console.log(postImage);
    //console.log(content);
    //     const attachment = req.file;
    //     const likes = req.body.likes;
  });
};

exports.getAllPost = (req, res) => {
  //   const token = req.headers.token;

  //   jwt.verify(token, "RANDOM_TOKEN_SECRET", (err, decoded) => {
  //     const userId = decoded.userId;
  //     console.log(token);
  // },

  Post.findAll().then((Post) =>
    res.status(201).json({
      Post,

      message: "got all post",
    })
  );
};
/*
exports.getOnePost = (req, res) => {
  Post.findAll({
    where: { id: res.params.id },
    include: [User],
  }).then((Post) => res.status(201).json({ Post, message: "got one post" }));
};
*/
