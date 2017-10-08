class CreateNode {
  constructor(key, value) {
    if (typeof key != "undefined" && key !== null) {
        this.key = key;
    }
    if (typeof value != "undefined" && value !== null) {
        this.value = value;
    }
    this.key = key;
    this.value = value;
    this.time = new Date().getTime();
    this.prev = null;
    this.next = null;
  }
}

module.exports = CreateNode;
