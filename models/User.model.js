const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const userSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, 'Please add a username'],
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      rrequired: [true, 'Please add a valid email'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    slackID: {
      type: String,
      required: false,
      unique: true,
      trim: true,
    },
    googleID: {
      type: String,
      required: false,
      unique: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const User = model("User", userSchema);

module.exports = User;
