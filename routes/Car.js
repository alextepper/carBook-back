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

router.route("/").get(getAllCars).post(requireSignIn, createCar);
router.route("/:id").get(getCar).put(updateCar).delete(deleteCar);

module.exports = router;
