const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Post = require("./Post");

// Create Schema
const UserSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: [true, "First Name is Required"],
    },

    lastname: {
      type: String,
      required: [true, "Last Name is Required"],
    },

    image: {
      type: String,
    },

    email: {
      type: String,
      unique: true,
      trim: true,
      required: [true, "Email is Required"],
    },

    password: {
      type: String,
      required: [true, "Password is Required"],
    },

    isBlocked: {
      type: Boolean,
      default: false,
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    viewers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    posts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
      },
    ],

    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],

    blocked: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    plan: {
      type: String,
      enum: ["Free", "Premium", "Pro"],
      default: "Free",
    },

    userAward: {
      type: String,
      enum: ["Bronze", "Silver", "Gold"],
      default: "Bronze",
    },

    resetPasswordToken: String,
    resetPasswordExpires: Date,
  },
  { toJSON: { virtuals: true } },
  { timestamps: true }
);

// @desc Get Full Name
UserSchema.virtual("fullname").get(function () {
  return `${this.firstname} ${this.lastname}`;
});

// @desc Get initials
UserSchema.virtual("initials").get(function () {
  return `${this.firstname[0]}${this.lastname[0]}`;
});

// @desc Get post counts
UserSchema.virtual("postCounts").get(function () {
  return this.posts.length;
});

// @desc get followers count
UserSchema.virtual("followersCount").get(function () {
  return this.followers.length;
});

// @desc get followers count
UserSchema.virtual("followingCount").get(function () {
  return this.following.length;
});

//get viewers count
UserSchema.virtual("viewersCount").get(function () {
  return this.viewers.length;
});

// @desc get blocked count
UserSchema.virtual("blockedCount").get(function () {
  return this.blocked.length;
});

// @desc Last Date User Created a Post
UserSchema.pre("findOne", async function (next) {
  // get the user id
  const userId = this._conditions._id;
  // find the post created by the user
  const posts = await Post.find({ author: userId });

  if (posts.length > 0) {
    // get the last post date
    const lastPostDate = posts[posts.length - 1].createdAt;
    const lastPostDateStr = lastPostDate.toDateString();

    // --------- Last Post Date ---------- //

    UserSchema.virtual("lastPostDate").get(function () {
      return lastPostDateStr;
    });

    // --------- Check if the user inactive for 30 days ---------- //

    const currentDate = new Date();

    const diff = (currentDate - lastPostDate) / (1000 * 3600 * 24);

    if (diff > 30) {
      UserSchema.virtual("isInactive").get(function () {
        return true;
      });
      await mongoose
        .model("User")
        .findByIdAndUpdate(userId, { isBlocked: true }, { new: true });
    } else {
      UserSchema.virtual("isInactive").get(function () {
        return false;
      });
      await mongoose
        .model("User")
        .findByIdAndUpdate(userId, { isBlocked: false }, { new: true });
    }

    // --------- Last Active Date Of A User ---------- //

    const daysAgo = Math.floor(diff);
    UserSchema.virtual("lastActive").get(function () {
      if (daysAgo <= 0) {
        return "today";
      } else if (daysAgo === 1) {
        return "yesterday";
      } else {
        return `${daysAgo} days ago`;
      }
    });

    // --------- Upgrade User Account  ---------- //

    if (posts.length < 10) {
      await mongoose
        .model("User")
        .findByIdAndUpdate(userId, { userAward: "Bronze" }, { new: true });
    } else if (posts.length < 20) {
      await mongoose
        .model("User")
        .findByIdAndUpdate(userId, { userAward: "Silver" }, { new: true });
    } else {
      await mongoose
        .model("User")
        .findByIdAndUpdate(userId, { userAward: "Gold" }, { new: true });
    }
  }
  next();
});

// @desc Hash Password
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// @desc Create Model
const User = mongoose.model("User", UserSchema);
module.exports = User;
