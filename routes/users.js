var express = require('express')
var router = express.Router()
const User = require('../models/users');

//simple logger
function logRequest(req) {
  console.log('%s %s %s', req.method, req.url, req.path)
}


// all requests to this router will first hit this middleware
router.get('/', async (req, res, next) => {
  logRequest(req);
  try {
    const users= await User.find();
    users.forEach((obj) => {
      console.log(`- ${obj.name}`);
    })
    res.render('users/index', {
      users: users
    });
  }
  catch {
    res.redirect('/');
  }
  next();
})

//this route is invoked when we click the new user button
router.get('/new', function (req, res, next) {
  logRequest(req);
  //we render our ejs new file
  res.render('users/new', {user: new User()});
  next();
})

//!!!!! here router.post uses '/' which corresponds to '/users' 
router.post('/', async (req, res) => {
  logRequest(req);
  const response = "Create with name : " + req.body.name;
  const user = new User({
    name: req.body.name
  })

  try {
    const result = await user.save();
    // res.redirect(`users/${user.id}`);
    res.redirect(`users/new`);
  }
  catch {
      res.render('users/new', {
        user: user,
        errorMessage: 'Error creating new user'
      });
  }
})

// NEED TO UNDERSTAND HOW ASYNC AWAIT WITH MONGO 

// async function createUser(name) {
//   try {
//     const newUser = new User({
//       name: name
//     })
//     const result = await newUser.save();
//     return result;
//   }
//   catch {
//     return console.error('oops')
//   }
// }

// newUser.save().then(
//   () => {console.log('new user created?')},
//   err => {console.error(err)}
// );

// newUser.save((err, user) => {
//   if(err) {
//     res.render('users/new', {
//       user: user,
//       errorMessage: 'Error creating new user'
//     });
//   }
//   else {
//     // res.redirect(`users/${user.id}`);
//     res.redirect(`users/new`);

//   }
// })

module.exports = router
