const Interface = require('./interface');

// Interfaces
const Storage = new Interface('Storage', ['setItem', 'getItem', 'removeItem']);

// Class implements Storage
const Cache = (() => {
  const _cache = {};

  return class Cache {
    setItem(key, value) {
      _cache[key] = value;
    }
    getItem(key) {
      return _cache[key];
    }
    removeItem(key) {
      return delete _cache[key];
    }
  }
})();

// test
function update(storageInstance) {
  Interface.ensureImplements(storageInstance, Storage);
  storageInstance.setItem('customer', { name: 'test' });
  const customer1 = storageInstance.getItem('customer');
  console.log(customer1);
  storageInstance.removeItem('customer');
  const customer2 = storageInstance.getItem('customer');
  console.log(customer2);
}

const cache = new Cache();
update(cache);
