const http = require('http');
const url = require('url');
const Router = require('./router');

function Application () {
  this._router = new Router()
}

http.METHODS.forEach(function (method) {
  method = method.toLowerCase();
  Application.prototype[method] = function () {
    this._router[method].apply(this._router, arguments);
    return this;
  }
});

Application.prototype.listen = function (...args) {
  const self = this;
      let server = http.createServer(function (req, res) {

        self.handle(req, res);

      });

      server.listen(...args);
}

Application.prototype.handle = function (req, res) {
  // 添加send方法
  if (!res.send) {
    res.send = function (body) {
      res.writeHead(200, {
        'Content-Type': 'text/plain'
      });
      res.end(body);
    }
  }

  this._router.handle(req, res);
}

exports = module.exports = Application;
