var Promise = require('bluebird');
var request = require('request');

module.exports = {
  sendMessage: function (message) {
    var promise = new Promise(function (resolve, reject) {
      if (!message.chat_id || !message.text) {
        reject(new Error('empty chat_id or text'));
      } else {
        request.post('https://api.telegram.org/bot130906513:AAG6u4Jr8txCneVcha57SXAb9vsDbs1lINg/sendMessage', {form: {
          chat_id: message.chat_id || '500 - SERVER ERROR',
          text: message.text || '500 - SERVER ERROR',
          parse_mode: message.parse_mode,
          disable_web_page_preview: message.disable_web_page_preview,
          disable_notification: message.disable_notification,
          reply_to_message_id: message.reply_to_message_id,
          reply_markup: message.reply_markup
        }}, function (err, res, body) {
          if (err) {
            reject(new Error(err));
          } else {
            body = JSON.parse(body);
            if (body.ok) {
              resolve(body.result);
            } else {
              reject(new Error('message was not sent'));
            }
          }
        });
      }
    });
    return promise;
  }
};
