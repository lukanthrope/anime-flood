const mongoose = require("mongoose");
const jwt = require('jsonwebtoken');
const secretkey = require('../keys/jwtSecretKey');

const Schema = mongoose.Schema;

const userScheme = new Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    minlength: [6, 'Short password'],
  },
});

const User = mongoose.model("User", userScheme);

module.exports = app => {
  app.post("/api/registration", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    
    const user = new User({ username, password });
    
    User.findOne({username}, async (err, usr) => {
      if (err) console.log(err);
      if (usr) {
        res.send('username taken');
      } else {
        try {
          const result = await user.save();
          const token = await jwt.sign({ user }, secretkey, { expiresIn: '30d' });

          res.send({ result, registred: true, token });
        } catch(err) {
          console.log(err);
          res.send(err.message.substring(24));
        }
      }
    });
  });

  app.post("/api/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({ username, password }, (err, usr) => {
      if (usr) { 
        jwt.sign({ usr }, secretkey, { expiresIn: '30d' }, async (err, token) => {
          res.send(token);
        });
      }
      else {
        res.send('wrong username or password');
      }
    });
  });

  app.get('/api/chat', verifyToken, (req, res) => {
    jwt.verify(req.token, secretkey, err => {
      if(err) {
        res.sendStatus(403);
      } else {
        res.sendStatus(200);
      }
    });
  })
 
  function verifyToken(req, res, next) {
    // Get auth header value
    const bearerHeader = req.headers['authorization'];
    // Check if bearer is undefined
    if(typeof bearerHeader !== 'undefined') {
      // Split at the space
      const bearer = bearerHeader.split(' ');
      // Get token from array
      const bearerToken = bearer[1];
      // Set the token
      req.token = bearerToken;
      // Next middleware
      next();
    } else {
      // Forbidden
      res.sendStatus(403);
    }
  
  }
}