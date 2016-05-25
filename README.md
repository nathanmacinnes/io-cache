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
If you're using them, you should probably set up a helper to prevent such
statements being littered all over the place.

IOCache is your helper. Set up an IOCache with it's external resource from the
start:
````javascript
var cachedFs = new IOCache(fs.readFile);
````
Then read the arguments from the first call every time:
````javascript
cachedFs.get(filename, function (err, contents) {
    if (!err) {
        callback(contents);
    }
});
````

IOCache will sort out working out whether or not it's cached. It's always async,
just so you know.

TODO
----
 * Expire items in cache. Currently this can be done with
`delete cachedFS.cache[filename]`, but there should be a better way.
