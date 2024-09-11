const Car = require("../model/Car"); // Adjust the path as necessary
const apiError = require("../utils/apiError"); // Adjust the path as necessary

const checkCarOwnership = async (req, res, next) => {
  try {
    const car = await Car.findById(req.params.id);

    if (!car) {
      return next(new apiError("Car not found", 404));
    }

    if (car.owner.toString() !== req.user.id) {
      return next(
        new apiError("You are not authorized to perform this action", 403)
      );
    }

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = checkCarOwnership;
