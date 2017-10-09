# redis-proxy
A Redis Proxy with local cache implementation.

## Running the tests

To run the tests
```
$ git clone https://github.com/tejasrr19/redis-proxy.git
$ cd redis-proxy
$ make test
```
* The tests use the `config.json` file to get their respective configs.

> Note: The host is set to 'redis' as the tests run on `docker-compose`.

## Highlevel Architecture Overview

### LocalCache

* The LocalCache is implemented using a Doubly Linked List and a Map data structures.
* The doubly linked list is used to track how often a key is used.
  * The head is the least recently used key
  * The tail is most recently used key.
* The LocalCache class has methods that can set keys and get values.
* All writes (set) are written directly to the backing redis and bypasses the LocalCache.
* All gets are directed to the LocalCache. If the key doesn't exist in the LocalCache, then the get is performed on the backing Redis and then stored in the LocalCache. 
* The LocalCache has a fixed size and any additional set will evict the LRU key from the cache.
* Also, each key can have an expiration in the localCache. If a key expires, it gets evicted. This expiration is set when a localCache instance is created.

### Backing Redis

* The backing redis is the fallback data storage. 
* All writes are directed to the backing redis.
* The backing redis is instantiated when a new LocalCache instance is created.
* Host and port can be configured.

## Example Proxy Usage
An Example
```javascript
const LocalCache = require('./lib/localCache.js');

const config = {
  redisHost: 'localhost',
  redisPort: 6379,
  capacity: 5,
  expiry: 10000
};

async function test() {
  const client1 = new LocalCache(config);

  await client1.setBackingRedis('foo', 'bar');
  await client1.setBackingRedis('zoo', 'car');
  await client1.setBackingRedis('moo', 'cow');

  var res = await client1.get('moo');  // From backing Redis
  console.log('RES ----->', res); 
  res = await client1.get('zoo');  // From backing Redis
  console.log('NEW RES ----->', res);
  res = await client1.get('doo');   // null
  console.log('NEW RES ----->', res);
  setTimeout(async () => {
    res = await client1.get('moo');
    console.log('After Timeout ----->', res); // from localCache
  }, 2000);
}

console.log(test());

```
## Time Spent

* Redis Protocol - ~ 1.5 hrs (some learning curve)
* Single Backing Instance - ~ 1 hr 
* Cached GET - ~ 0.5 hr
* Global Expiry - 0.25 hr
* LRU Eviction - 1.5 hr
* Fixed key size - 0.5 hr
* Tests - 1 hrs
* Documentation - 0.5 hr

## NOT DONE

LocalCache optimizations for parallel concurrent processing.

### TO DO
Package into an npm package.
