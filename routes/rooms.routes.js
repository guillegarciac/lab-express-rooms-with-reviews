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

/* GET form view */
/* ROUTE /rooms/new */
router.get('/new', function (req, res, next) {
  res.render('newRoom');
});

/* POST get users show inputs */
/* ROUTE /rooms/new */
router.post('/new', async function (req, res, next) {
  const { name, description, imageUrl } = req.body;
  try {
    const createdRoom = await Room.create({ name, description, imageUrl });
    res.redirect(`/rooms/${createdRoom._id}`);
  } catch (error) {
    next(error)
  }
});

/* GET one room */
/* ROUTE /rooms/:roomId */
router.get('/:roomId', async function (req, res, next) {
  const { roomId } = req.params;
  const user = req.session.currentUser;
  try {
    const room = await Room.findById(roomId);
    res.render('roomDetail', { room, user });
  } catch (error) {
    next(error)
  }
});


module.exports = router;