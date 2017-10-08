const expect = require('chai').expect;
const LocalCache = require('../lib/localCache.js');
const config = require('../config.json').client2;

function delay(t) {
   return new Promise(function(resolve) {
       setTimeout(resolve, t)
   });
}

describe('========= Key Expiry Test ==========', () => {
  var client;
  before('Create client instance', (done) => {
    client = new LocalCache(config);
    done();
  });

  it('Should set values to backing redis', () => {
    return new Promise(async (resolve) => {
      await client.setBackingRedis('foo', 'bar');
      resolve();
    });
  });

  it('Should get value from Backing Redis if not in Local Cache', () => {
    return new Promise(async (resolve) => {
      var value = await client.get('foo');
      expect(value).to.equal('bar');
      await delay(1000);
      value = await client.get('foo');
      expect(value).to.equal(null);
      resolve();
    });
  });
});
