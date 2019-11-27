const express = require('express');

const app = express();

app.use(function (req, res, next) {
  res.charset='utf8';
  next();
});

app.get('/', function (req, res, next) {
  console.log(1);
  setTimeout(() => {
    throw new Error('出错了');
  })
});

app.get('/', function (req, res, next) {
  console.log(2);
  res.end('Hello World!');
});

app.use(function (error, req, res, next) {
  console.log(error);
  res.send(error);
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
