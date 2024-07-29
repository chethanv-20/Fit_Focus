var express = require('express');
var router = express.Router();
const Nutrition = require('./nutrition');
const Login = require('./login_schema'); // Ensure this path is correct
const session = require('express-session');

// Middleware to handle sessions
router.use(session({
  secret: 'your_secret_key', // Replace with a strong, unique secret key
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set to true if using HTTPS
}));

// Middleware to check if the user is authenticated
function isAuthenticated(req, res, next) {
  if (req.session.user) {
    return next();
  } else {
    res.redirect('/login');
  }
}

/* GET home page. */
router.get('/', (req, res) => {
  res.render('home');
});

/* GET bot page. */
router.get('/bot', isAuthenticated, (req, res) => {
  res.render('bot');
});

/* GET calorie calculator page. */
router.get('/cal_cal', isAuthenticated, (req, res) => {
  res.render('cal_cal');
});

/* GET articles page. */
router.get('/articles', isAuthenticated, async (req, res) => {
  try {
    const nutritionDetails = await Nutrition.find();
    res.render('articles', { nutritionDetails });
  } catch (err) {
    res.status(500).send('Server error');
  }
});

/* POST new article. */
router.post('/articles', isAuthenticated, async (req, res) => {
  try {
    const { title, content } = req.body;
    const newNutrition = new Nutrition({ title, content });
    await newNutrition.save();
    res.redirect('/articles');
  } catch (err) {
    res.status(500).send('Backend down');
  }
});

/* GET profile page. */
router.get('/profile', isAuthenticated, (req, res) => {
  const user = req.session.user;
  res.render('profile', { user });
});

/* GET login page. */
router.get('/login', (req, res) => {
  res.render('login');
});

/* POST login credentials. */
router.post('/login', async (req, res) => {
  try {
    const { name, password } = req.body;
    const user = await Login.findOne({ name, password });

    if (user) {
      req.session.user = user;
      res.redirect('/profile');
    } else {
      res.status(401).send('Invalid credentials');
    }
  } catch (err) {
    res.status(500).send('Server error');
  }
});

/* GET logout route. */
router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send('Logout failed');
    }
    res.redirect('/login');
  });
});

module.exports = router;
