module.exports = IOCache;
module.exports.IOCache = module.exports;

IOCache.prototype.get = iocGet;

function IOCache(external) {
  this.external = external;
  this.cache = {};
}
function iocGet() {
  var
    args = Array.from(arguments),
    callback,
    ioCache = this,
    key;
  callback = args[args.length - 1];
  key = args[0];
  if (this.cache.hasOwnProperty(key)) {
    process.nextTick(getFromCache);
    return;
  }
  this.external.apply(null, args.slice(0, -1).concat(assignToCache));
  function assignToCache() {
    ioCache.cache[key] = arguments;
    ioCache.get.apply(ioCache, args);
  }
  function getFromCache() {
    callback.apply(null, ioCache.cache[key]);
  }
}
