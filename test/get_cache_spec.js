const expect = require('chai').expect;
const LocalCache = require('../lib/localCache.js');
const config = require('../config.json').client1;
console.log('Clien1 ---->', config);
const data = {
  key: 'foo',
  value: 'bar'
};

describe('========= Get Test ==========', () => {
  var client;
  before('Create client instance', (done) => {
    client = new LocalCache(config);
    done();
  });

  it('Should set values to backing redis', () => {
    return new Promise(async (resolve) => {
      await client.setBackingRedis(data.key, data.value);
      console.log('Key Inserted');
      resolve();
    });
  });

  it('Should get value from Backing Redis if not in Local Cache', () => {
    return new Promise(async (resolve) => {
      const value = await client.get(data.key);
      console.log('Value ---->', value);
      expect(value).to.equal(data.value);
      resolve();
    });
  });

  it('Should get value from Local Cache if present', () => {
    return new Promise(async (resolve) => {
      const value = await client.get(data.key);
      console.log('Value ----->', value);
      expect(value).to.equal(data.value);
      resolve();
    });
  });
});
