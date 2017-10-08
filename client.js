
const LocalCache = require('./lib/localCache.js');
const config = require('./config.json').client1;
const async = require('async');

async function test() {
  const client1 = new LocalCache(2, 2000);
  await client1.deleteAllRedisKeys();

  // var res = await client1.get('moo');
  // console.log('RES ----->', res);
  // res = await client1.get('loo');
  // console.log('NEW RES ----->', res);
  // res = await client1.get('doo');
  // console.log('NEW RES ----->', res);
  // // setTimeout(async () => {
  // //   res = await client1.get('loo');
  // //   console.log('After Timeout ----->', res);
  // // }, 2000);
  // await client1.deleteAllRedisKeys();
  // res = await client1.get('doo');
  // console.log('NEW RES ----->', res);
}

console.log(test());
