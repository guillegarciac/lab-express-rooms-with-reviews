const router = require("express").Router();
const User = require("../models/User.model");
const Room = require("../models/Room.model");
const isLoggedIn = require('../middlewares');

/* GET users listing. */
router.get('/profile', isLoggedIn, function (req, res, next) {
  const user = req.session.currentUser;
  res.render('profile', user);
});

/* GET users listing. */
router.get('/profile/edit', isLoggedIn, function (req, res, next) {
  const user = req.session.currentUser;
  res.render('profileEdit', user);
});

router.post('/profile/edit', isLoggedIn, async function (req, res, next) {
  const { username } = req.body;
  const user = req.session.currentUser;
  try {
    const userInDB = await User.findByIdAndUpdate(user._id, { username }, { new: true });
    req.session.currentUser = userInDB;
    res.redirect('/profile');
  } catch (error) {
    next(error);
  }
});

/* GET my rooms */
/* ROUTE /rooms */
router.get('/profile/rooms', isLoggedIn, async function (req, res, next) {
  const user = req.session.currentUser;
  try {
    const rooms = await Room.find({owner: user}).populate('owner')
    res.render('profileRooms', { user, rooms });
  } catch (error) {
    next(error)
  }
});

module.exports = router;