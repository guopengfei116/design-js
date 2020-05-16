/**
 * 适配器模式(Adapter)：
 * 将一个类的接口转换成客户希望的另外一个接口，
 * 使得原本由于接口不兼容而不能一起工作的类可以一起工作。
 *
 * 产生原因：由于设计模式一开始是在静态编译型的语言中产生的，静态编译型语言一个很大特点就是有类型限制，
 *      适配器就是为解决不同类型的兼容性问题(通常是新类型兼容旧类型)而产生。
 *
 * js应用思考：由于js是动态类型，所以在类型上天生就是自动适配的，但是js的自动适配变相降低了程序健壮性，
 *      如果有复杂数据结构的变化需求，修改原版本代码是很危险的，转而使用适配器模式相对更加安全。
 *
 * 特点：不影响现有实现，向后兼容旧接口代码。
 *
 * 缺点：过多使用导致系统层级复杂。
 *
 * 建议：适配器本质上是一种亡羊补牢，它解决的是现有两个接口的不兼容性，不应该在软件初期开发阶段使用。
 *      如果在设计之初就能统筹规划好接口一致性，那么就可以减少适配器的使用。
 */

class GBSocket {
  insertGB(GBPlug) {
    GBPlug.electrify();
  }
}

class GBPlug {
  electrify() {
    console.log("国标插头通电");
  }
}

class BSSocket {
  insertBS(BSPlug) {
    BSPlug.electrify();
  }
}

class BSPlug {
  electrify() {
    console.log("英标插头通电");
  }
}

/**
 * 解决：国标插头插入英标插座
 *
 * 方式1：改写BSSocket类，增加insertGB方法，
 * 缺点是不利于复用insert逻辑，同时违返OCP开放封闭原则。
 *
 * 方式2：在外部使用适配器进行接口适配，然后插入英标插座
 */
class GB2BSAdapter {

  constructor(gbPlug) {
    this.gbPlug = gbPlug;
  }

  electrify() {
    console.log("国标适配英标");
    this.gbPlug.electrify();
  }
}

// 英标插排，国标插头
const bsSocket = new BSSocket();
const gbPlug = new GBPlug();

// 适配器包装调用
const gb2BsAdapter = new GB2BSAdapter(gbPlug);
bsSocket.insertBS(gb2BsAdapter);
