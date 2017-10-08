const expect = require('chai').expect;
const LocalCache = require('../lib/localCache.js');
const config = require('../config.json').client3;

describe('========= Cache Capacity Test ==========', () => {
  var client;
  before('Create client instance', (done) => {
    client = new LocalCache(config);
    done();
  });

  it('Should set values to backing redis', () => {
    return new Promise(async (resolve) => {
      await client.setBackingRedis('foo', 'bar');
      await client.setBackingRedis('zoo', 'car');
      await client.setBackingRedis('moo', 'cow');
      resolve();
    });
  });

  it('Should get value from Backing Redis if not in Local Cache', () => {
    return new Promise(async (resolve) => {
      var value = await client.get('foo');
      expect(value).to.equal('bar');
      value = await client.get('moo');
      expect(value).to.equal('cow');
      value = await client.get('zoo');
      expect(value).to.equal('car');
      resolve();
    });
  });
});
