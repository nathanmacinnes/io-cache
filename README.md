IOCache
=======
Cache external resources easily.

Most generic in-memory caching modules require statements like:
````javascript
if (cache.contains(filename)) {
    callback(cache.get(filename));
} else {
    fs.readFile(filename, function (err, contents) {
        cache.set(key, contents);
        callback(contents);
    });
}
````
If you're using them, you should probably set up a helper to prevent such statements
being littered all over the place.

IOCache is your helper. Set up an IOCache with it's external resource from the start:
````javascript
var cachedFs = new IOCache(function (filename, callback) {
    fs.readFile(filename, function (err, data) {
        callback(data);
    });
});
cachedFs.get(filename, callback);
````

IOCache will sort out working out whether or not it's cached. It's always async,
just so you know.

To do
-----
 * allow passing multiple arguments, so that setup is as simple as `cachedFs = new IOCache(fs.readFile);`
