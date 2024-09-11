const asyncHandler = require("express-async-handler");
const Review = require("../model/Review");

// @desc    Get all reviews
// @route   GET /api/reviews
// @access  Public
exports.getAllReviews = asyncHandler(async (req, res, next) => {
  const reviews = await Review.find().populate("creator configuration");
  res.status(200).json({ success: true, data: reviews });
});

// @desc    Get single review
// @route   GET /api/reviews/:id
// @access  Public
exports.getReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id).populate(
    "creator configuration"
  );
  if (!review) {
    return res.status(404).json({ success: false, error: "Review not found" });
  }
  res.status(200).json({ success: true, data: review });
});

// @desc    Create new review
// @route   POST /api/reviews
// @access  Private
exports.createReview = asyncHandler(async (req, res, next) => {
  const review = await Review.create(req.body);
  res.status(201).json({ success: true, data: review });
});

// @desc    Update review
// @route   PUT /api/reviews/:id
// @access  Private
exports.updateReview = asyncHandler(async (req, res, next) => {
  let review = await Review.findById(req.params.id);
  if (!review) {
    return res.status(404).json({ success: false, error: "Review not found" });
  }
  review = await Review.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({ success: true, data: review });
});

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private
exports.deleteReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id);
  if (!review) {
    return res.status(404).json({ success: false, error: "Review not found" });
  }
  await review.remove();
  res.status(200).json({ success: true, data: {} });
});
