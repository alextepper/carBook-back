const express = require("express");
const app = express();

//
const apiError = require("./utils/apiError");
const { globalErrHandler } = require("./utils/globalErrHandler");

// access environment variables
require("dotenv").config();

// connect to database
require("./config/database");

// middleware
app.use(express.json()); // pass income payload

// routes
const userRouters = require("./routes/User");
const authRouters = require("./routes/Auth");
const categoryRouters = require("./routes/Category");
const postRouters = require("./routes/Post");
const commentRouters = require("./routes/Comment");
const carRoutes = require("./routes/Car");
const reviewRoutes = require("./routes/Review");
const configurationRoutes = require("./routes/Configuration");
const cors = require("cors");
const morgan = require("morgan");

app.use(
  cors({
    origin: "http://localhost:5173", // Allow only this origin
  })
);
app.use(morgan("dev"));

// routes middlware
app.use("/api/users", userRouters);
app.use("/api/auth", authRouters);
app.use("/api/categories", categoryRouters);
app.use("/api/posts", postRouters);
app.use("/api/comments", commentRouters);
app.use("/api/cars", carRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/configurations", configurationRoutes);

// 404 error
app.all("*", (req, res, next) => {
  // create error
  const err = new apiError(`Can't find this route ${req.originalUrl}`, 400);
  // send it to Global errors handling middlware
  next(err);
});

// Global Error Handlers Middleware
app.use(globalErrHandler);

// Listen To Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`server is running on ${PORT}`);
});
