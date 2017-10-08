const expect = require('chai').expect;
const LocalCache = require('../lib/localCache.js');
const config = require('../config.json').client1;
const data = {
  key: 'foo',
  value: 'bar'
};
describe('========= Set Redis Data Test ==========', () => {
  const client = new LocalCache(config);
  it('Should set values to backing redis', async () => {
    return new Promise(async (resolve) => {
      await client.setBackingRedis(data.key, data.value);
      console.log('Key Inserted');
      const value = await client.get(data.key);
      expect(value).to.equal(data.value);
      resolve();
    });
  });
});
