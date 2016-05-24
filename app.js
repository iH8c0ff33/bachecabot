'use strict';
var express = require('express');
var bodyParser = require('body-parser');
var Database = require('sequelize');
var bot = require(__dirname+'/bot.js');
var spaggiari = require(__dirname+'/spaggiari.js');

var db = new Database('postgres://daniele@localhost:5432/telegram');
var User = db.import(__dirname+'/models/user.js');
var PrivateChat = db.import(__dirname+'/models/privateChat.js');
var Data = db.import(__dirname+'/models/data.js');
var Credential = db.import(__dirname+'/models/credential.js');
User.hasOne(PrivateChat);
PrivateChat.belongsTo(User);
User.hasOne(Data);
Data.belongsTo(User);
PrivateChat.hasOne(Credential);
Credential.belongsTo(PrivateChat);

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

var serializeUser = require(__dirname+'/middleware/serialize.js');

app.all('/api/telegrambot/130906513:AAG6u4Jr8txCneVcha57SXAb9vsDbs1lINg',
serializeUser(User, PrivateChat), function (req, res) {
  if (req.body.update_id) {
    console.log(req.body);
    if (req.body.message.entities) {console.log(req.body.message.entities);}
    res.send('OK');
  } else {
    res.send('ERROR');
  }
  if (req.body.message.text) {
    if (req.data) {
      if (req.data.action) {
        if (req.data.action.login) {
          if (req.body.message.entities) {
            if (req.body.message.text.slice(req.body.message.entities[0].offset,
              req.body.message.entities[0].offset+req.body.message.entities[0]
              .length).search(/^\/start(@sunCorp_bot)?$/) > -1) {
              req.data.action.login = undefined;
              req.data.update(req.data).then(function () {
                bot.sendMessage({
                  chat_id: req.user.id,
                  text: 'Login Login aborted!'
                });
              });
            }
          }
          if (req.data.action.login.insert == 'school') {
            var actionToWrite = req.data.action;
            actionToWrite.login.school = req.body.message.text;
            actionToWrite.login.insert = 'username';
            req.data.update({action: actionToWrite}).then(function (updatedData) {
              bot.sendMessage({
                chat_id: req.user.id,
                text: 'Insert field '+updatedData.action.login.insert+' or type /cancel to cancel login'
              });
            });
            } else if (req.data.action.login.insert == 'username') {
              var actionToWrite = req.data.action;
              actionToWrite.login.username = req.body.message.text;
              actionToWrite.login.insert = 'password';
              req.data.update({action: actionToWrite}).then(function (updatedData) {
                bot.sendMessage({
                  chat_id: req.user.id,
                  text: 'Insert field '+updatedData.action.login.insert+' or type /cancel to cancel login'
                });
              });
            } else if (req.data.action.login.insert == 'password') {
              var actionToWrite = req.data.action;
              actionToWrite.login.password = req.body.message.text;
              actionToWrite.login.insert = 'confirm';
              req.data.update({action: actionToWrite}).then(function (updatedData) {
                console.log(updatedData.action);
                bot.sendMessage({
                  chat_id: req.user.id,
                  text: 'Is this data correct?\nSchool: \"'+updatedData.action.login.school+'\"\nUsername: \"'+updatedData.action.login.username+'\"\nPassword: \"'+updatedData.action.login.password+'\"\nPlease type \"yes\" or \"no\"'
                });
              });
            } else if (req.data.action.login.insert == 'confirm') {
              if (req.body.message.text.search(/yes/i) > -1) {
                bot.sendMessage({
                  chat_id: req.user.id,
                  text: 'trying to log in...'
                }).then(function () {
                  return spaggiari.login(req.data.action.login.school, req.data.action.login.username, req.data.action.login.password)
                }).then(function (body) {
                  req.chat.createCredential({
                    custcode: req.data.action.login.school,
                    login: req.data.action.login.username,
                    password: req.data.action.login.password
                  }).then(function () {
                    var actionToWrite = req.data.action;
                    actionToWrite.login = undefined;
                    req.data.update({action: actionToWrite}).then(function (updatedData) {
                      bot.sendMessage({
                        chat_id: req.body.message.chat.id,
                        text: 'Successfully logged in! Saved credentials fot future uses :)'
                      });
                    });
                  });
                }, function (err) {
                  var actionToWrite = req.data.action;
                  actionToWrite.login = undefined;
                  req.data.update({action: actionToWrite}).then(function (updatedData) {
                    bot.sendMessage({
                      chat_id: req.body.message.chat.id,
                      text: 'Wrong credentials ;( Try again to /login'
                    });
                  });
                });
              } else if (req.body.message.text.search(/no/i) > -1) {
                var actionToWrite = req.data.action;
                req.data.action.login = undefined;
                req.data.update({action: actionToWrite}).then(function (updatedData) {
                  bot.sendMessage({
                    chat_id: req.user.id,
                    text: 'Login aborted!'
                  });
                });
              } else {
                bot.sendMessage({
                  chat_id: req.user.id,
                  text: 'please type \"yes\" or \"no\".'
                });
              }
            }
          }
        }
      }
      if (req.body.message.entities) {
        if (req.body.message.text.slice(req.body.message.entities[0].offset, req.body.message.entities[0].offset+req.body.message.entities[0].length).search(/^\/start(@sunCorp_bot)?$/) > -1) {
          req.user.getDatum().then(function (foundData) {
            if (!foundData) {
              return bot.sendMessage({
                chat_id: req.body.message.chat.id,
                text: 'Creating chat data...'
              }).then(function () {
                req.user.createDatum().then(function () {
                  bot.sendMessage({
                    chat_id: req.body.message.chat.id,
                    text: 'Created chat data. You can now start using this bot!'
                  });
                });
              });
            }
            bot.sendMessage({
              chat_id: req.body.message.chat.id,
              text: 'There no need to do that. This chat has already data created!'
            });
          });
        } else if (req.body.message.text.slice(req.body.message.entities[0].offset, req.body.message.entities[0].offset+req.body.message.entities[0].length).search(/^\/login(@sunCorp_bot)?$/) > -1) {
          if (!req.data) {
            return bot.sendMessage({
              chat_id: req.body.message.chat.id,
              text: 'Sorry, you need to /start@sunCorp_bot before using this bot ;('
            });
          }
          return req.data.update({action: {
            login: {
              insert: 'school',
              chat_id: req.body.message.chat.id
            }
          }}).then(function (updatedData) {
            bot.sendMessage({
              chat_id: req.user.id,
              text: 'Insert field '+updatedData.action.login.insert+' or type /cancel to cancel login'
            });
          });
        }
      }
    }
  });

  User.sync({force: true}).then(function () {
    return PrivateChat.sync({force: true});
  }).then(function () {
    return Data.sync({force: true});
  }).then(function () {
    return Credential.sync({force: true});
  }).then(function () {
    return db.sync({force: true});
  }).then(function () {
    app.listen(3000);
  });
