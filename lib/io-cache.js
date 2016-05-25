module.exports = IOCache;
module.exports.IOCache = module.exports;

IOCache.prototype.get = ecGet;

function IOCache(external) {
  this.cache = {};
  this.external = external;
}
function ecGet(key, callback) {
  var ioCache = this;
  if (callback === undefined) {
    callback = key;
    key = undefined;
  }
  if (this.cache.hasOwnProperty(key)) {
    process.nextTick(getFromCache);
    return;
  }
  if (key === undefined) {
    this.external(assignToKeylessCache);
  } else {
    this.external(key, assignToKeyedCache);
  }
  function assignToKeyedCache() {
    ioCache.cache[key] = arguments;
    ioCache.get(key, callback);
  }
  function assignToKeylessCache() {
    ioCache.cache[key] = arguments;
    ioCache.get(callback);
  }
  function getFromCache() {
    callback.apply(null, ioCache.cache[key]);
  }
}
