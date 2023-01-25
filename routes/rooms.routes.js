const router = require("express").Router();
const User = require("../models/User.model");
const Room = require("../models/Room.model");
const isLoggedIn = require('../middlewares');

/* GET all rooms */
/* ROUTE /rooms */
router.get('/', async function (req, res, next) {
  try {
    const rooms = await Room.find({}).sort({ title: 1 });
    res.render('roomView', { rooms });
  } catch (error) {
    next(error)
  }
});

module.exports = router;