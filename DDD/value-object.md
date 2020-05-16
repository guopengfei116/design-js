# 值对象在前端的应用

## 初学乍练

在一个前端页面中，我们需要给用户提供一个可修改某状态的有限变化时，很有多人这么干，看起来蛮清爽的。

下面使用了一个下拉菜单，让用户修改状态，你也可以使用checkbox或其他展现形式的组件，在这里我们不讨论交互层面的东西，只讨论编程。

```html
<select
  v-model="formModel.monitorStatus"
  placeholder="应用类型"
>
  <option :key="1" :value="1">新增</option>
  <option :key="2" :value="2">开启</option>
  <option :key="3" :value="3">停用</option>
</select>
```

现在有个地方需要展示状态，怎么办？

```html
<div>
  <span v-if="formModel.monitorStatus === 1">新增</span>
  <span v-else-if="formModel.monitorStatus === 2">开启</span>
  <span v-else-if="formModel.monitorStatus === 3">停用</span>
  <span v-else>无</span>
</div>
```

如果想给用户提供一个默认值，怎么办？设个值呗，看起来相当简单！

```js
formModel.monitorStatus = 1;
```

如果有多个页面需要这个功能，怎么办？当然是复制了！一个字就是爽！

```html
<!-- Page1 -->
......

<!-- Page2 -->
......

<!-- Page3 -->
......
```

每个页面的默认值可能不一样怎么办？设不同的默认值喽，傻Diao！

```js
// Page1
formModel.monitorStatus = 1;

// Page2
formModel.monitorStatus = 2;

// Page3
formModel.monitorStatus = 3;
```

后来值对应的含义变了怎么办？啥？靠，xxxxx！

## 略有小成

首先一个状态只有可选的几个值，并且每个值有对应的描述，那么我们可以把它定义为如下的枚举类型。

```js
export const MONITOR_STATUS_ENUM = [[1, "新建"], [2, "开启"], [3, "停用"]];
```

然后在视图中使用这个枚举类型，当菜单项需要变动的时候我们修改枚举类型即可。

```html
<select
  v-model="formModel.monitorStatus"
  placeholder="应用类型"
>
  <option
    v-for="item in MONITOR_STATUS_ENUM"
    :key="item[0]"
    :value="item[0]"
  >{{ item[1] }}</option>
</select>
```

现在有个地方需要展示状态，怎么办？加个字典查阅就好。

```javascript
export const MONITOR_STATUS_ENUM = [[0, "新建"], [1, "开启"], [2, "关闭"]];
export const MONITOR_DESC_MAP = new Map(MONITOR_STATUS_ENUM);
```

可能你会想到这种方式，但是在我们这个例子中，它会不会有什么问题，卖个关子，欢迎大家讨论。

```js
const MONITOR_DESC_MAP = Object.fromEntries(MONITOR_STATUS_ENUM);
```

顺带注册个过滤器方便用。

```html
<div>{{ formModel.monitorStatus | toStatusDesc }}</div>

<!-- 语义写法，实际不能这么干，你懂的 -->
filter toStatusDesc(status) {
  const result = MONITOR_DESC_MAP.get(status);
  return result ? result : "无";
}
```

如果想给用户设置一个默认值，怎么办？

```js
// 这样写代码的可读性很差，如果我不打开枚举类型的定义文件，我根本无法得知1的含义是什么
formModel.monitorStatus = 1;
```

配套一个语义字典，这样可以大幅提升可读性。

```js
export const MONITOR_STATUS_ENUM = [[1, "新建"], [2, "开启"], [3, "停用"]];
export const MONITOR_DESC_MAP = new Map(MONITOR_STATUS_ENUM);
export const MONITOR_STATUS_DICT = {
  "create": 1,
  "start": 2,
  "stop": 3
};

// 这样可读性有了
formModel.monitorStatus = MONITOR_STATUS_DICT.create;
```

多个页面不同默认状态怎么办？这, 无需多言了吧。

```js
// Page1
formModel.monitorStatus = MONITOR_STATUS_MAP.create;

// Page2
formModel.monitorStatus = MONITOR_STATUS_MAP.start;

// Page3
formModel.monitorStatus = MONITOR_STATUS_MAP.stop;
```

后来值的含义变了怎么办？改枚举类型和含义映射就好了。

```js
export const MONITOR_STATUS_ENUM = [[0, "新建"], [1, "开启"], [2, "关闭"]];
export const MONITOR_STATUS_DICT = Object.fromEntries(MONITOR_STATUS_ENUM);
export const MONITOR_STATUS_MAP = {
  "create": 0,
  "start": 1,
  "stop": 2
};
```

## 驾轻就熟

感觉确实还可以，但是每次设置默认值，或者脱离视图通过js修改状态，都需要依赖Map映射，有点繁琐，能不能改进一下？擦，果然给了粮食就会要肉吃...

而且这种方法第一次写起来麻烦就麻烦把，后面用起来还这么麻烦，保不准哪天我就越过Map映射直接赋个值，嘿嘿~_~。靠，给自己挖坑还好意思说...

好吧，再送一个锦囊给你 -> 值对象

```js
// 老东西，无需多言
const MONITOR_STATUS_ENUM = [[1, "新建"], [2, "开启"], [3, "停用"]];
const MONITOR_DESC_MAP = new Map(MONITOR_STATUS_ENUM);
const MONITOR_STATUS_DICT = {
  "create": 1,
  "start": 2,
  "stop": 3
};

// 所谓的值对象类
export default class MonitorStatus {

  // 通过一个静态属性暴露
  static enum = MONITOR_STATUS_ENUM;

  // 私有化，不让随便改
  #value = null;

  // 向外暴露，增加了规则校验
  set value(status) {
    if (!this.isMeaningful(status)) {
      throw new Error(`
        不存在状态: ${status}，
        可选的状态有：${Object.values(MONITOR_STATUS_DICT)}
      `);
    }

    this.#value = status;
  }

  get value() {
    return this.#value;
  }

  constructor(status) {
    this.value = status;
  }

  // 校验status有效性
  isMeaningful(status) {
    return !!MONITOR_DESC_MAP.get(status);
  }

  // 得到状态描述
  toDesc() {
    return MONITOR_DESC_MAP.get(this.status);
  }

  // 语义化修改状态
  updateByTag(tag) {
    const status = MONITOR_STATUS_DICT[tag];

    if (status == null) {
      throw new Error(`
        不存在状态: ${tag}，
        可选的状态有：${Object.keys(MONITOR_STATUS_DICT)}
      `);
    }

    this.#value = status;
  }
}
```

现在使用时，只导入这个类就好了，感觉比以前更内聚了。

```js
import MonitorStatus from "xxx";

// 拿枚举值
const MONITOR_STATUS_ENUM = MonitorStatus.enum;

// 创建值对象
formModel.monitorStatus = new MonitorStatus(db.status);
```

提供选项试图时，视图绑定的值对应value属性。

```html
<select
  v-model="formModel.monitorStatus.value"
  placeholder="应用类型"
>
  <option
    v-for="item in MONITOR_STATUS_ENUM"
    :key="item[0]"
    :value="item[0]"
  >{{ item[1] }}</option>
</select>
```

某个地方需要展示状态，调个方法即可。

```html
<div>{{ formModel.monitorStatus.toDesc() }}</div>
```

设置默认值，同样调个方法。

```js
formModel.monitorStatus.updateByTag("start");
```

需要用脚本修改值，根据情况赋值或者调方法

```js
// value赋值：从某种渠道拿到的状态值赋值，无需担心值越界
formModel.monitorStatus.value = 2;

// 调方法：明确更新成某种状态，更语义化
formModel.monitorStatus.updateByTag("stop");
```

后来值的含义变了，同样修改枚举类型和含义映射就好了。

```js
const MONITOR_STATUS_ENUM = [[0, "新建"], [1, "开启"], [2, "关闭"]];
const MONITOR_DESC_MAP = new Map(MONITOR_STATUS_ENUM);
const MONITOR_STATUS_DICT = {
  "create": 0,
  "start": 1,
  "stop": 2
};

export default class MonitorStatus {
  ......
}
```

我靠，似乎有点复杂，又似乎有点叼，要不要用呢？ 随你喽~~~

要是这个数据我要提交给后端怎么办？传个对象过去不得把它弄崩了=_=! 弄崩不至于，砍你倒是有可能，这个问题还是要解决一下。

首先，如果你用了这个值对象，保不准将来会有多个种，为了区分它们，我们定义个父类，能用接口的话定义个接口最好，这样可以强制约定几个关键方法的命名，比如 `isMeaningful，toDesc，updateByTag` 。

```js
class BaseValueObject {

  // 如果子类没有重写，那么JSON.stringify序列化值对象时就会忽略它
  get value() {
    return undefined;
  }
}

// 子类继承就好
class MonitorStatus extends BaseValueObject {}
class XXX extends BaseValueObject {}
```

现在大多数情况下，我们都是通过JSON格式进行数据传输的，这里我们使用JSON.stringify和它的自定义能力就好了，为了方便，你可以把这个转换逻辑封装到请求前置拦截器里面。

```js
const fromModel = { a: 1, b: new MonitorStatus(1) };
JSON.stringify(fromModel, (key, val) => {
  // 值对象取其value属性
  if (val instanceof BaseValueObject) return val.value;
  return val;
});
```
