const { Schema, model } = require("mongoose");

const roomSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a room name'],
      lowercase: true
    },
    description: {
      type: String,
      required: [true, 'Please add a room description'],
    },
    imageUrl: {
      type: String,
      default: 'https://www.genius100visions.com/wp-content/uploads/2017/09/placeholder-vertical.jpg',
      required: [true, 'Please add an image'],
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    reviews: []
  },
  {
    timestamps: true,
  }
);

const Room = model("Room", roomSchema);

module.exports = Room;