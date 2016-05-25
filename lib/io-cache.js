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

  function assignToKeyedCache(val) {
    ioCache.cache[key] = val;
    ioCache.get(key, callback);
  }
  function assignToKeylessCache(val) {
    ioCache.cache[key] = val;
    ioCache.get(callback);
  }
  function getFromCache() {
    callback(ioCache.cache[key]);
  }
}
