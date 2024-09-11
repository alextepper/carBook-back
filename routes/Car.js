const express = require("express");
const {
  getAllCars,
  getCar,
  createCar,
  updateCar,
  deleteCar,
} = require("../controllers/carController");
const router = express.Router();
const { requireSignIn } = require("../middlwares/authMiddlwares");
const checkCarOwnership = require("../middlwares/ownershipMiddleware");

router.route("/").get(getAllCars).post(requireSignIn, createCar);
router
  .route("/:id")
  .get(getCar)
  .put(requireSignIn, checkCarOwnership, updateCar)
  .delete(requireSignIn, checkCarOwnership, deleteCar);

module.exports = router;
