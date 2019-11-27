const url = require('url');
const Layer = require('./layer');
const Route = require('./route');
const http = require('http');

function Router() {
  const defaultLayer = new Layer('*', function (req, res) {
      res.end(`Cannot resolve the request ${ req.method } ${ req.url }`)
    });

  this.stack = [defaultLayer]
}

http.METHODS.forEach(function(method) {
  method = method.toLowerCase();

  Router.prototype[method] = function (path, handler) {
    // 创建route只要path信息
    const route = this.route(path);
    // 创建
    route[method].call(route, handler);
    return this;
  };

})



Router.prototype.handle = function (req, res) {
  const { pathname } = url.parse(req.url, true);
  const method = req.method.toLowerCase();

  for (let i=1; i<this.stack.length; i++) {
    const layer = this.stack[i];
    // 这里目前只判断了路径
    if (layer.match(pathname)) {
      // 如果是路由中间件
      if (layer.route) {
        // 判断route中是否有绑定该方法的处理函数
        if (layer.route.match_method(method)) {
          // 这里layer的handle 实际上就是 route.dispatch.bind(route) 这里传入的，而这个就是循环遍历route.stack的
          layer.handle_request(req, res);
        }
      } else {
        //  todo use添加的中间件

        // 这里就直接执行app.use传入的处理函数
        layer.handle_request(req, res);
      }
    }
  }

  this.stack[0].handle_request(req, res);
};

// 根据路径创建router的一层
Router.prototype.route = function (path) {
  const route = new Route(path);

  const layer = new Layer(path, route.dispatch.bind(route));

  // 为这个layer添加一个rout属性
  layer.route = route;

  this.stack.push(layer);
  return route;
};

exports = module.exports = Router;
