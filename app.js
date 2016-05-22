var express = require('express');
var bodyParser = require('body-parser');
var Database = require('sequelize');

var db = new Database('postgres://daniele@localhost:5432/telegram');
var User = db.define('user', {
  id: {
    type: Database.INTEGER(),
    unique: true,
    allowNull: false,
    primaryKey: true
  },
  first_name: Database.STRING(),
  last_name: Database.STRING(),
  username: Database.STRING()
});
var PrivateChat = db.define('privateChat', {
  id: {
    type: Database.INTEGER(),
    unique: true,
    allowNull: false,
    primaryKey: true
  }
});
User.hasOne(PrivateChat);
PrivateChat.belongsTo(User);
User.sync();
PrivateChat.sync();
db.sync();

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.all('/api/telegrambot/130906513:AAG6u4Jr8txCneVcha57SXAb9vsDbs1lINg', function (req, res) {
  if (req.body.update_id) {
    console.log(req.body);
    if (req.body.message.entities) {console.log(req.body.message.entities)}
    res.send('OK');
  } else {
    res.send('ERROR');
  }
});

app.listen(3000, '192.168.1.4')
