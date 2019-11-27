const Layer = require('./layer');
const http = require('http');

function Route(path) {
  this.path = path;
  this.stack = [];
  this.methods = {};
}

Route.prototype.match_method = function (method) {
  method = method.toLowerCase();
  return Boolean(this.methods[method]);
};

http.METHODS.forEach(function(method) {
  method = method.toLowerCase();
  
  Route.prototype[method] = function (fn) {
    const layer = new Layer('/', fn);
    layer.method = method;
    this.methods[method] = true;
    this.stack.push(layer);
  
    return this;  // 支持级联
  };
});




Route.prototype.dispatch = function (req, res) {
  const self = this,
    method = req.method.toLowerCase();

  // 这里就是把原来的路径和请求方式分开来进行判断
  for (let i=0; i<this.stack.length; i++) {
    if (method === self.stack[i].method) {
      return self.stack[i].handle_request(req, res);
    }
  }
};

exports = module.exports = Route;
