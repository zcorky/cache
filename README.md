# Cache [![Build Status](https://travis-ci.org/zcorky/cache.svg?branch=master)](https://travis-ci.org/zcorky/cache)

> A simple cache lib

## Install

```
$ npm install @zcorky/cache
```


## Usage

```js
const Cache = require('@zcorky/cache').Cache;
// import Cache from '@zcorky/cache'; // ts or es6

// create cache instance
const cache = new Cache(2);
// const cache = Cache.create(2);

// set key, value
cache.set(key, value);

// get key
cache.get(key);

// value2
cache.set(key2, value2);
// get key
cache.get(key2);

// cache size
cache.size();

// cache is empty
cache.empty();

// cache is full
cache.full();

// cache has key
cache.hasKey(key);

// cache remove key
cache.remove(key);

// cache clear
cache.clear(key);

// cache hits
cache.hits();
```

## License

MIT © [Moeover](https://moeover.com)