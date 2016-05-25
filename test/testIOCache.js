var
  Chance = require('chance'),
  expect = require('expect.js'),
  injectr = require('injectr'),
  pretendr = require('pretendr'),
  seed;

// Pass a seed with the environment variable.
// The environment variable should normally be left blank, and only populated
// when repeatable results are required for debugging.
seed = process.env.TEST_SEED || (new Chance()).natural();

// Print the current seed so that results can be repeated.
console.log('\nPseudorandom number seed: ' + seed.toString());

describe('IOCache', function () {
  var
    cb,
    IOCache,
    mockProcess,
    random;

  beforeEach(function () {

    // Ensure results are repeatable but seeded differently for each test.
    random = new Chance(this.currentTest.title, seed);

    cb = pretendr(function () {});
    mockProcess = pretendr({
      nextTick: function () {}
    });

    IOCache = injectr('../lib/io-cache.js', {}, {
      process: mockProcess.mock,
      console: console
    });
  });

  it("has a property to itself", function () {
    expect(IOCache.IOCache).to.equal(IOCache);
  });
  it("is callable as an instance", function () {
    expect(new IOCache()).to.be.an(IOCache);
  });
  describe("#get", function () {
    var
      cache,
      keys,
    mockExternal;
    beforeEach(function () {
      mockExternal = pretendr();
      cache = new IOCache(mockExternal.mock);
      keys = random.n(random.string, random.natural({ min: 2, max: 5 }));
    });
    it("calls the passed function once for each key", function () {
      keys.forEach(function (key, index) {
        cache.get(key, cb.mock);
        expect(mockExternal.calls).to.have.length(index + 1);
        mockExternal.calls[index].args[1]('');
        cache.get(key, cb.mock);
        nextTick();
        expect(mockExternal.calls).to.have.length(index + 1);
      });
    });
    it("won't call from the cache until nextTick", function () {
      keys.forEach(function (key, index) {
        cache.get(key, cb.mock);
        mockExternal.calls[index].args[1]('');
        cache.get(key, cb.mock);
        nextTick();
        expect(cb.calls).to.have.length(2 * index + 1);
        nextTick();
        expect(cb.calls).to.have.length(2 * index + 2);
      });
    });
    it("passes the key to the external", function () {
      keys.forEach(function (key, index) {
        cache.get(key, cb.mock);
        expect(mockExternal.calls[index].args)
          .to.have.property(0, key);
        expect(mockExternal.calls[index].args[1]).to.be.a('function');
      });
    });
    it("passes callback arg from external to callback every time", function () {
      keys.forEach(function (key, index) {
        var v = {};
        cache.get(key, cb.mock);
        mockExternal.calls[0].args[1](v);
        nextTick();
        expect(cb.calls[cb.calls.length - 1].args).to.have.property(0, v);
        cache.get(key, cb.mock);
        nextTick();
        expect(cb.calls[cb.calls.length - 1].args).to.have.property(0, v);
      });
    });
    describe("with only 1 argument", function () {
      it("expects the external function to only have a callback", function () {
        cache.get(cb.mock);
        expect(mockExternal.calls[0].callback)
          .to.equal(mockExternal.calls[0].args[0]);
      });
      it("calls the passed function only once", function () {
        cache.get(cb.mock);
        expect(mockExternal.calls).to.have.length(1);
        mockExternal.calls[0].args[0](random.string());
        cache.get(cb.mock);
        expect(mockExternal.calls).to.have.length(1);
      });
    });
  });
  function nextTick() {
    if (mockProcess.nextTick.calls.length) {
      mockProcess.nextTick.calls.shift().args[0]();
    }
  }
});