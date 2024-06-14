const asyncHandler = require("express-async-handler");
const Car = require("../model/Car");

// @desc    Get all cars
// @route   GET /api/cars
// @access  Public
exports.getAllCars = asyncHandler(async (req, res, next) => {
  let query;

  // Check if the request has a user parameter
  if (req.query.user) {
    // Fetch cars that belong to the specified user
    query = Car.find({ owner: req.query.user }).populate("configuration owner");
  } else {
    // Fetch all cars
    query = Car.find().populate("configuration owner");
  }

  const cars = await query;

  res.status(200).json({ success: true, data: cars });
});

// @desc    Get single car
// @route   GET /api/cars/:id
// @access  Public
exports.getCar = asyncHandler(async (req, res, next) => {
  const car = await Car.findById(req.params.id).populate("configuration owner");
  if (!car) {
    return res.status(404).json({ success: false, error: "Car not found" });
  }
  res.status(200).json({ success: true, data: car });
});

// @desc    Create new car
// @route   POST /api/cars
// @access  Private
exports.createCar = asyncHandler(async (req, res, next) => {
  // Add the authenticated user as the owner
  const car = await Car.create({
    ...req.body,
    owner: req.user._id,
  });

  res.status(201).json({ success: true, data: car });
});

// @desc    Update car
// @route   PUT /api/cars/:id
// @access  Private
exports.updateCar = asyncHandler(async (req, res, next) => {
  let car = await Car.findById(req.params.id);
  if (!car) {
    return res.status(404).json({ success: false, error: "Car not found" });
  }
  car = await Car.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({ success: true, data: car });
});

// @desc    Delete car
// @route   DELETE /api/cars/:id
// @access  Private
exports.deleteCar = asyncHandler(async (req, res, next) => {
  const car = await Car.findById(req.params.id);
  if (!car) {
    return res.status(404).json({ success: false, error: "Car not found" });
  }
  await car.remove();
  res.status(200).json({ success: true, data: {} });
});
