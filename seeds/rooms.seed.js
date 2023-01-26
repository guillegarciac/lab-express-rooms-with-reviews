const mongoose = require ("mongoose");
const Room = require ("../models/Room.model");
const MONGODB_URI = 'mongodb://localhost:27017/rooms-app';
mongoose.set('strictQuery', true);
const rooms = require('../data/rooms');

mongoose
  .connect(MONGODB_URI)
  .then(x => {
    console.log(`Connected to the database: "${x.connection.name}"`);
    return Room.deleteMany();
  })
  .then(() => {
    return Room.create(rooms);
  })
  .then(createdRooms => console.log(createdRooms))
  .then(() => {
    mongoose.disconnect();
  })
  .catch(error => {
    console.error('Error connecting to the database', error);
  });