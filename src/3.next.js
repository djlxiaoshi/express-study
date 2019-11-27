const express = require('express');

const app = express();

app.get('/', function (req, res, next) {
  console.log(1);
  next();
  console.log(2);
});

app.get('/', function (req, res, next) {
  console.log(3);
  res.end('Hello World!');
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
