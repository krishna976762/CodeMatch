const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
      minlength: [3, "First name must be at least 3 characters"],
      maxlength: [20, "First name must be at most 20 characters"],
    },

    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
      minlength: [2, "Last name must be at least 2 characters"],
      maxlength: [20, "Last name must be at most 20 characters"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email address",
      ],
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false, // hides password from queries
    },

    age: {
      type: Number,
      min: [18, "Age must be at least 18"],
      max: [100, "Age must be below 100"],
    },

    gender: {
      type: String,
      enum: {
        values: ["male", "female","other"],
        message: "Gender must be male,female or other",
      },
    },

    photoUrl: {
      type: String,
      match: [
        /^https?:\/\/.+/,
        "Photo URL must be a valid URL",
      ],
    },

    skills: {
      type: [String],
      validate: {
        validator: function (arr) {
          return arr.length <= 10;
        },
        message: "You can add up to 10 skills only",
      },
    },

    about: {
      type: String,
      default: "This is default value",
      maxlength: [300, "About section cannot exceed 300 characters"],
    },
  },
  { timestamps: true }
);

//
// 👉 Default photo based on gender
//
// userSchema.pre("save", function (next) {
//   if (!this.photoUrl) {
//     if (this.gender === "female") {
//       this.photoUrl =
//         "https://static.vecteezy.com/system/resources/previews/042/332/098/non_2x/default-avatar-profile-icon-grey-photo-placeholder-female-no-photo-images-for-unfilled-user-profile-greyscale-illustration-for-socail-media-web-vector.jpg";
//     } else {
//       // male OR gender not provided
//       this.photoUrl =
//         "https://cdn.vectorstock.com/i/500p/96/77/blank-grey-scale-profile-picture-placeholder-vector-51589677.jpg";
//     }
//   }
//   next();
// });

const User = mongoose.model("User", userSchema);
module.exports = User;
