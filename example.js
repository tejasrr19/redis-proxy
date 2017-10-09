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

  var res = await client1.get('moo');
  console.log('RES ----->', res);
  res = await client1.get('zoo');
  console.log('NEW RES ----->', res);
  res = await client1.get('doo');
  console.log('NEW RES ----->', res);
  setTimeout(async () => {
    res = await client1.get('moo');
    console.log('After Timeout ----->', res);
  }, 2000);
}

console.log(test());
