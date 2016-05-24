var Promise = require('bluebird');

module.exports = function (User, PrivateChat) {
  var middleware = function (req, res, next) {
    User.find({where: {id: req.body.message.from.id}}).then(function (foundUser) {
      if (!foundUser) {
        console.log('user not found creating...');
        return User.create({
          id: req.body.message.from.id,
          first_name: req.body.message.from.first_name,
          last_name: req.body.message.from.last_name,
          username: req.body.message.from.username
        }).then(function (createdUser) {
          console.log('user created: '+createdUser.id);
          return createdUser;
        });
      } else {
        console.log('found user: '+foundUser.id);
        return foundUser;
      }
    }).then(function (user) {
      req.user = user;
      if (req.body.message.chat.type == 'private') {
        return Promise.all([
          user.getPrivateChat({where: {id: req.body.message.chat.id}}).then(function (foundChat) {
            if (!foundChat) {
              return user.createPrivateChat({id: req.body.message.chat.id}).then(function (createdChat) {
                console.log('private chat created: '+createdChat.id);
                return createdChat;
              });
            } else {
              console.log('found private chat: '+foundChat.id);
              return foundChat;
            }
          }),
          user.getDatum().then(function (datum) {
            return datum;
          })
        ]);
      } else {
        console.log('WARNING chat type \"'+req.body.message.chat.type+'\" UNKNOWN')
        return next();
      }
    }).then(function (res) {
      req.chat = res[0];
      req.data = res[1];
      return next();
    });
  };
  return middleware;
};
