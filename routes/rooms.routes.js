const router = require("express").Router();
const User = require("../models/User.model");
const Room = require("../models/Room.model");
const isLoggedIn = require('../middlewares');

/* GET all rooms */
/* ROUTE /rooms */
router.get('/', isLoggedIn, async function (req, res, next) {
  const user = req.session.currentUser;
  try {
    const rooms = await Room.find({}).populate('owner').sort({ title: 1 });
    res.render('rooms/roomView', { user, rooms });
  } catch (error) {
    next(error)
  }
});

/* GET form view */
/* ROUTE /rooms/new */
router.get('/new', isLoggedIn, function (req, res, next) {
  const user = req.session.currentUser;
  res.render('rooms/newRoom', { user });
});

/* POST get users show inputs */
/* ROUTE /rooms/new */
router.post('/new', isLoggedIn, async function (req, res, next) {
  const user = req.session.currentUser;
  const { name, description, imageUrl } = req.body;
  const regexUrl = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/
  if (!regexUrl.test(imageUrl)) {
    res.render('rooms/newRoom', { error: 'image needs to be a valid http:// address'});
    return;
  }
  try {
    const room = await Room.create({ name, description, imageUrl, owner: user});
    res.redirect('/rooms');
  } catch (error) {
    next(error)
  }
});

/* GET one room */
/* ROUTE /rooms/:roomId */
router.get('/:roomId', isLoggedIn, async function (req, res, next) {
  const { roomId } = req.params;
  const user = req.session.currentUser;
  try {
    const room = await Room.findById(roomId).populate('owner');
    res.render('rooms/roomDetail', { user, room });
  } catch (error) {
    next(error)
  }
});

/* GET one room edit */
/* ROUTE /rooms/:roomId/edit */
router.get('/:roomId/edit', isLoggedIn, async function (req, res, next) {
  const { roomId } = req.params;
  const user = req.session.currentUser;
  try {
    const room = await Room.findById(roomId).populate('owner');
    res.render('rooms/roomEdit', { user, room });
  } catch (error) {
    next(error)
  }
});

/* POST Room Update */
/* ROUTE rooms/:roomId/edit */
router.post('/:roomId/edit', isLoggedIn, async (req, res, next) => {
  const user = req.session.currentUser;
  const { roomId } = req.params;
  const { name, description, imageUrl } = req.body;
  try {
    await Room.findByIdAndUpdate(roomId._id, { name, description, imageUrl, owner: user }, {new:true})
    res.redirect('/rooms')
  } catch (error) {
    next(error)
  }
});

/* GET delete Room */
/* ROUTE rooms/:roomId/delete */
router.get('/:roomId/delete', isLoggedIn, async (req, res, next) => {
  const user = req.session.currentUser;
  const { roomId } = req.params;
  try {
    const room = await Room.findById(roomId).populate('owner');
    if (room.owner._id == user._id) {
      await Room.findByIdAndRemove(roomId);
      res.redirect('/rooms')
    } else {
      res.redirect('/rooms')
    }
  } catch (error) {
    next(error)
  }
});

module.exports = router;