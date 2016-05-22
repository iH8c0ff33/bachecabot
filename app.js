"use strict";
var express = require('express');
var bodyParser = require('body-parser');
var Database = require('sequelize');

var db = new Database('postgres://daniele@localhost:5432/telegram');
var User = db.import(__dirname+'/models/user.js');
var PrivateChat = db.import(__dirname+'/models/privateChat.js');
var Data = db.import(__dirname+'/models/data.js');
User.hasOne(PrivateChat);
PrivateChat.belongsTo(User);
User.hasOne(Data);
Data.belongsTo(User);
db.sync();

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

var serializeUser = require(__dirname+'/middleware/serialize.js');

app.all('/api/telegrambot/130906513:AAG6u4Jr8txCneVcha57SXAb9vsDbs1lINg', serializeUser(User, PrivateChat), function (req, res) {
  if (req.body.message.text) {
    if (req.body.message.entities) {
      if (req.body.message.text.slice(req.body.message.entities[0].offset, req.body.message.entities[0].offset+req.body.message.entities[0].length-1).search(/^\/start(@sunCorp_bot)?$/) > -1) {

      }
    }
  }
  if (req.body.update_id) {
    console.log(req.body);
    if (req.body.message.entities) {console.log(req.body.message.entities)}
    res.send('OK');
  } else {
    res.send('ERROR');
  }
});

app.listen(3000, '192.168.1.4')
