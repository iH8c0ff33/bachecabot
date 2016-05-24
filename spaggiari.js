var request = require('request');
var cheerio = require('cheerio');
var Promise = require('bluebird');
var cookieJar = request.jar();

module.exports = {
  login: function (school, username, password) {
    var promise = new Promise(function (resolve, reject) {
      request({
        url: 'https://web.spaggiari.eu/home/app/default/login.php',
        method: 'POST',
        jar: cookieJar,
        formData: {
          action: 'login.php',
          custcode: school,
          login: username,
          password: password
        }
      }, function (err, res, body) {
        if (res.statusCode == '302') {
          resolve(cookieJar);
        } else {
          reject();
        }
      });
    });
    return promise;
  }
}
