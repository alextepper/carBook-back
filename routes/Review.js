const express = require("express");
const {
  getAllReviews,
  getReview,
  createReview,
  updateReview,
  deleteReview,
} = require("../controllers/reviewController");
const router = express.Router();

router.route("/").get(getAllReviews).post(createReview);
router.route("/:id").get(getReview).put(updateReview).delete(deleteReview);

module.exports = router;
