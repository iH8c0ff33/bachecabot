var express = require('express');
var app = express();
app.all('/api/telegrambot/130906513:AAG6u4Jr8txCneVcha57SXAb9vsDbs1lINg', function (req, res) {
  console.log(req.url)
  res.send('OK');
});
app.listen(3000, '192.168.1.4')
