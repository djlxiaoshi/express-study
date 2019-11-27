const express = require('express');

const app = express();

app.use(function (req, res, next) {
  console.log('没有路径的中间件');
  next();
});

app.use('/water', function (req, res, next) {
  console.log('过滤杂质');
  next();
});

app.get('/water', function (req, res) {
  res.end('water');
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
