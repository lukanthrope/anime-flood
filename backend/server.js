const mongoose = require("mongoose");
const express = require('express');
const helmet = require('helmet');
const logger = require('morgan');
const fs = require('fs');
const http = require('http');
const socketIO = require('socket.io');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const dbUrl = require('./db/db');

const app = express();
const server = http.Server(app);
const io = socketIO(server);
const PORT = 3001;

app.use(logger('dev'));
app.use(helmet());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(fileUpload());
app.use(express.static('public'));

const Schema = mongoose.Schema;
const messageScheme = new Schema({
  author: String,
  url: String,
});
const Message = mongoose.model("Message", messageScheme);


io.on('connection', async socket => {
  socket.on('mes', async data => {                                                                          
    io.emit('new message', data)
    const mes = new Message(data);                                                                                        
    await mes.save();
  });
});

mongoose.connect(dbUrl, { useNewUrlParser: true }, (err) => {
  if (err) console.log(err);
  server.listen(PORT, () => console.log(`listening on ${PORT}...`));
});

app.get('/api/messages', async (req, res) => {
  const messages = await Message.find();
  res.send(messages);
});

require('./routes/auth-router')(app);
require('./routes/upload')(app);
