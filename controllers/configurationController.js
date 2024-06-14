const Configuration = require("../model/Configuration");
const asyncHandler = require("express-async-handler");

// @desc    Create a new configuration
// @route   POST /api/configurations
// @access  Public
const createConfiguration = asyncHandler(async (req, res) => {
  const {
    name,
    pictures,
    taxCategory,
    make,
    model,
    generation,
    engine,
    gearbox,
    fuelType,
    power,
    score,
    averagePrice,
    reviews,
  } = req.body;

  const configuration = new Configuration({
    name,
    pictures,
    taxCategory,
    make,
    model,
    generation,
    engine,
    gearbox,
    fuelType,
    power,
    score,
    averagePrice,
    reviews,
  });

  const createdConfiguration = await configuration.save();
  res.status(201).json(createdConfiguration);
});

// @desc    Get all configurations
// @route   GET /api/configurations
// @access  Public
const getConfigurations = asyncHandler(async (req, res) => {
  try {
    const { make, model, year } = req.query;

    let query = {};

    if (make) query.make = make;
    if (model) query.model = model;
    if (year) query["generation.years"] = parseInt(year);

    const configurations = await Configuration.find(query);

    res.status(200).json(configurations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @desc    Get a configuration by ID
// @route   GET /api/configurations/:id
// @access  Public
const getConfigurationById = asyncHandler(async (req, res) => {
  const configuration = await Configuration.findById(req.params.id);

  if (configuration) {
    res.json(configuration);
  } else {
    res.status(404).json({ message: "Configuration not found" });
  }
});

// @desc    Update a configuration by ID
// @route   PUT /api/configurations/:id
// @access  Public
const updateConfiguration = asyncHandler(async (req, res) => {
  const {
    name,
    pictures,
    taxCategory,
    make,
    model,
    generation,
    engine,
    gearbox,
    fuelType,
    power,
    score,
    averagePrice,
    reviews,
  } = req.body;

  const configuration = await Configuration.findById(req.params.id);

  if (configuration) {
    configuration.name = name || configuration.name;
    configuration.pictures = pictures || configuration.pictures;
    configuration.taxCategory = taxCategory || configuration.taxCategory;
    configuration.make = make || configuration.make;
    configuration.model = model || configuration.model;
    configuration.generation = generation || configuration.generation;
    configuration.engine = engine || configuration.engine;
    configuration.gearbox = gearbox || configuration.gearbox;
    configuration.fuelType = fuelType || configuration.fuelType;
    configuration.power = power || configuration.power;
    configuration.score = score || configuration.score;
    configuration.averagePrice = averagePrice || configuration.averagePrice;
    configuration.reviews = reviews || configuration.reviews;

    const updatedConfiguration = await configuration.save();
    res.json(updatedConfiguration);
  } else {
    res.status(404).json({ message: "Configuration not found" });
  }
});

// @desc    Delete a configuration by ID
// @route   DELETE /api/configurations/:id
// @access  Public
const deleteConfiguration = asyncHandler(async (req, res) => {
  const configuration = await Configuration.findById(req.params.id);

  if (configuration) {
    await configuration.remove();
    res.json({ message: "Configuration removed" });
  } else {
    res.status(404).json({ message: "Configuration not found" });
  }
});

module.exports = {
  createConfiguration,
  getConfigurations,
  getConfigurationById,
  updateConfiguration,
  deleteConfiguration,
};
