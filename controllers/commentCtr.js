const asyncHandler = require("express-async-handler");
const Comment = require("../model/Comment");
const Post = require("../model/Post");
const User = require("../model/User");
const handler = require("../controllers/handlersFactory");

exports.createComment = asyncHandler(async (req, res) => {
  // Create Comment
  const comment = await Comment.create(req.body);

  // add comment to post
  await Post.findByIdAndUpdate(
    req.post._id,
    {
      $addToSet: { comments: comment._id },
    },
    { new: true }
  );

  // add comment to user
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $addToSet: { comments: comment._id },
    },
    { new: true }
  );

  res.status(201).json({ data: comment });
});
