// ℹ️ package responsible to make the connection with mongodb
// https://www.npmjs.com/package/mongoose
const mongoose = require("mongoose");
mongoose.set('strictQuery', false);

// ℹ️ Sets the MongoDB URI

const MONGO_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/rooms-app";

mongoose
  .connect(MONGO_URI)
  .then((x) => {
    const databaseName = x.connections[0].name;
    console.log(`Connected to Mongo! Database name: "${databaseName}"`);
  })
  .catch((err) => {
    console.error("Error connecting to mongo: ", err);
  });
