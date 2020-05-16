/**
 * 单例模式(Singleton)：
 * 保证一个类有且仅有一个实例，并且自行实例化向整个系统提供全局访问点。
 *
 * 产生原因：某些类在整个系统中因业务需求只能有一个实例，或者没必要产生多实例的工具类，
 *      为避免业务逻辑错误，或没必要的资源消耗而产生。
 *
 * js应用思考：由于js是动态类型且多范式的，某个类型的实例不一定用类创建，
 *      相对而言它的指导意义更大，比如使用字面量{}就可以构建一个单例。
 *
 * 特点：具有标识意义，且预防资源损坏。
 *
 * 缺点：改成多例的成本高。
 *
 * 建议：在设计之初要谨慎分析日后变成多例的可能性，工具类一般不会是多例的。
 */

class Earth {
  static instance = null;
  r = "6371km";
  s = `${5.1*10^8}km^2`;

  constructor() {
    return Earth.instance || this;
  }

  static getEarth() {
    if (!this.instance) {
      this.instance = new Earth();
    }
    return this.instance;
  }
}

const earthOne = Earth.getEarth();
const earthTwo = new Earth();

console.log(earthOne === earthTwo);
