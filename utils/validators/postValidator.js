const { body, validationResult } = require("express-validator");
const validatorResult = require("../../middlwares/validatorMiddlwares");

exports.createPostValidator = [
  body("title")
    .notEmpty()
    .withMessage("title is not allowed to be empty")
    .isLength({ max: 20 })
    .withMessage(
      "title length must be less than or equal to 20 characters long"
    )
    .isLength({ min: 5 })
    .withMessage("title length must be at least 5 characters long"),
  body("description")
    .notEmpty()
    .withMessage("description is not allowed to be empty")
    .isLength({ max: 600 })
    .withMessage(
      "title length must be less than or equal to 600 characters long"
    ),

  validatorResult,
];
