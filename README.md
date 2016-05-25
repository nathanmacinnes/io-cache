IOCache
=======
Cache external resources easily.

Most generic in-memory caching modules require statements like:
````javascript
if (cache.contains(object)) {
    callback(cache.get(object));
} else {
    someExternalProcess(object, callback);
}
````

Set up an IOCache with it's external resource from the start:
````javascript
cachedFs = new IOCache(fs.readFile);
cachedFs.get(filename, callback);
````

IOCache will sort out working out whether or not it's cached. It's always async,
just so you know.
