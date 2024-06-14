const express = require("express");
const router = express.Router();
const {
  createConfiguration,
  getConfigurations,
  getConfigurationById,
  updateConfiguration,
  deleteConfiguration,
} = require("../controllers/configurationController");

// Create a new configuration
router.post("/", createConfiguration);

// Get all configurations
router.get("/", getConfigurations);

// Get a configuration by ID
router.get("/:id", getConfigurationById);

// Update a configuration by ID
router.put("/:id", updateConfiguration);

// Delete a configuration by ID
router.delete("/:id", deleteConfiguration);

module.exports = router;
