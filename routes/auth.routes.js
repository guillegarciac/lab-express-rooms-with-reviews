const router = require("express").Router();
const bcrypt = require('bcrypt');
const saltRounds = 10;
const User = require("../models/User.model");
const isLoggedIn = require('../middlewares');

/* GET sign up view. */
router.get('/signup', function (req, res, next) { 
  res.render('auth/signup'); 
});

/* POST sign up */
router.post('/signup', async function (req, res, next) { 
  const { username, email, password, slackID, googleID } = req.body;
  if (!username || !email || !password) {
    res.render('auth/signup', { error: 'All fields are necessary.' });
    return;
  }
  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!regex.test(username)) {
    res.render('auth/signup', { error: 'username needs to contain at least 6 characters, one number, one lowercase and one uppercase letter.'});
    return;
  }
  if (!regex.test(password)) {
    res.render('auth/signup', { error: 'Password needs to contain at least 6 characters, one number, one lowercase and one uppercase letter.' });
    return;
  }
  try {
    const userInDB = await User.findOne({ email: email });
    if (userInDB) {
      res.render('auth/signup', { error: `There already is a user with email ${email}` });
      return;
    } else {
      const salt = await bcrypt.genSalt(saltRounds);
      const hashedPassword = await bcrypt.hash(password, salt);
      const user = await User.create({ username, email, hashedPassword, slackID, googleID });
      req.session.currentUser = user; 
      res.render('profile', user);
    }
  } catch (error) {
    next(error)
  }
});

/* GET log in view. */
router.get('/login', (req, res, next) => {
  res.render('auth/login');
});

/* POST log in view. */
router.post('/login', async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.render('auth/login', { error: 'Introduce email and password to log in' });
    return;
  }
  try {
    const userInDB = await User.findOne({ email: email });
    if (!userInDB) {
      res.render('auth/login', { error: `There are no users by ${email}` });
      return;
    } else {
      const passwordMatch = await bcrypt.compare(password, userInDB.hashedPassword);
      if (passwordMatch) {
        req.session.currentUser = userInDB;
        res.redirect('profile', {userInDB});
      } else {
        res.render('auth/login',  { error: 'Unable to authenticate user' });
        return;
      }
    }
  } catch (error) {
    next(error)
  }
});

/* GET logout */
router.get('/logout', isLoggedIn, (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      next(err)
    } else {
      res.clearCookie('lab-express-rooms-with-reviews')
      res.redirect('/auth/login');
    }
  });
});

module.exports = router;
