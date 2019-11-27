function Layer(path, fn) {
  this.path  = path;
  this.handle = fn;
}

Layer.prototype.handle_request = function (req, res) {
  if (this.handle) {
    this.handle(req, res);
  }
};

Layer.prototype.match = function (path) {
  return this.path === path || this.path === '*';
};

exports = module.exports = Layer;
