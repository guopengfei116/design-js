/***
 * 接口在运用设计模式实现复杂系统的时候最能体现其价值，
 * 它看似降低了JavaScript的灵活性，
 * 实际上，因为使用接口可以降低对象间的耦合度，所以从另一方面提高了灵活性。
 * 
 * 许多时候我们常常需要使用那些还未编写出来的API，或者需要提供一些占位代码以免延误开发进度；
 * 接口在这种场合的重要特性得以体现，它们记载着API，可作为程序员正式交流的工具；
 * 当占位代码被替换为最终API时，接口也可以帮助我们检测所需方法是否得到了实现。
 * 
 * 另外在开发过程中，如果API发生了变化，只要新的API实现了同样的接口，就能天衣无缝地替换原有API。
 **/
class Interface {

  /**
   * @method 检查对象是否实现接口
   * @param { Object }            检查对象
   * @param { Array[Interface] }  实现的接口
   **/
  static ensureImplements(object, interfaces) {
    if (arguments.length < 2) {
      throw new Error(
        `Static method Interface.ensureImplements called with ${arguments.length} arguments
        , but expected exactly 2.`
      );
    }

    interfaces.forEach(interface => {
      if (!interface instanceof Interface) {
        throw new Error(
          `Static method Interface.ensureImplements called Second parameter
          , above to be instances of Interface.`
        );
      }

      // 方法检查
      interface.methods.forEach(method => {
        if (!object[method] || typeof object[method] !== 'function') {
          throw new Error(
            `Static method Interface.ensureImplements
            : object does not implement the ${interface.name} interface
            . Method ${method} was not found.`
          );
        }
      });

      // 属性检查
      interface.properties.forEach(property => {
        if (property in object) {
          throw new Error(
            `Static method Interface.ensureImplements
            : object does not implement the ${interface.name} interface
            . Property ${property} was not found.`
          );
        }
      });
    });
  }

  constructor(name, methods, properties) {
    if (arguments.length < 2) {
      throw new Error(
        `Interface constructor called with ${arguments.length} arguments
        , but expected at least 2.`
      );
    }

    this.name = name;
    this.methods = methods.filter(method => typeof method === 'string');
    this.properties = properties.filter(property => typeof property === 'string');
  }
}
