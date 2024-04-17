<p align="center">
  <img src="./docs/img/title.png" style="transition: all 2.5s ease;" onmouseover="this.style.filter='hue-rotate(-80deg)'"  onmouseout="this.style.filter=''" width="400" />
</p>

<!--mds:cn-->
<!--mds:en-->
<!--mds:end-->
<!--mds:cn-->

<p align='center'>
  <a style="color:#D437B5;transition: all 0.5s ease;" onmouseover="this.style.color='#0069D3'"
    onmouseout="this.style.color='#D437B5'" href='./README.en.md'>English</a> | 简体中文 
</p>

<!--mds:en-->

<p align='center'>
  English |  <a style="color:#D437B5;transition: all 0.5s ease;" onmouseover="this.style.color='#0069D3'"
    onmouseout="this.style.color='#D437B5'"  href='./README.en.md'> 简体中文 </a> 
</p>

<!--mds:end-->

# ts-chain-core
<!--mds:cn-->
这是一个typescript链式编程的基础库，从随手编写的小工具到称手的工具集合都可以用它来完成
<!--mds:en-->
This is a basic library for TypeScript chain programming. It can be used to build anything from simple tools to comprehensive toolkits.
<!--mds:end-->


<!--mds:cn-->
### 特性

- 用最小的代码就能实现链式编程
- 节省代码量：在一些场合中，使用本库编写的工具可以使实际代码量减少一半甚至更多
-  **💥💥扩展接口自动补全** 无需事先定义你撰写的接口，即可在书写过程中获得代码补全！下面是实际效果展示（环境：vscode，无特殊插件）
![image](./docs/img/screenshot-1.gif)
- **🌈上手简单** 你只要掌握三个核心的api就可以编写出满足大部分需求的链式接口。
- **🚀小巧** 程序本体压缩后仅`3kb`大小。
<!--mds:en-->
### Features

- Enables chain programming with minimal code
- Saves code: tools built using this library can reduce actual code by half or more in some cases
-  **💥💥Auto Interface Completion **  Interfaces you write will automatically appear in your code as you type! Below is an actual demonstration (using vscode, no special plugins)
![image](./docs/img/screenshot-1.gif)
- **🌈Easy to use** You only need to master three core APIs to create chain interfaces that meet most needs.
- **🚀Compact** The program itself is only `3kb` in size after compression.
<!--mds:end-->


<!--mds:cn-->
### 快速开始

#### 安装
<!--mds:en-->
### Quick Start

#### Installation
<!--mds:end-->


```shell
npm i ts-chain-core
```

<!--mds:cn-->
#### 基本用法
<!--mds:en-->
#### Basic Usage
<!--mds:end-->

```ts
import { ChainCore } from "ts-chain-core";

ChainCore(null)
    .setFunction((name: string) => {
        console.log(`hello,${name}`);
    })
    ('🍉')
    ('🍍')
    ('🥭')
```

<!--mds:cn-->
#### 将类方法直接转换成链式方法
<!--mds:en-->
### 🔗Turning Class Methods into Chainable Methods
<!--mds:end-->

```ts
class Example {
    toChain(){
        return ChainCore(this).extendFunctionsFromObject(Example)
    }
    add(a:number,b:number){
        console.log(a+b)
    }
    addOne(a:number){
        return (b:number)=>{
            console.log(a+b)
        }
    }
    addEnd(a:number,b:number){
        return a+b;
    }
}

new Example().toChain()
    .add(3,5)   //8
    .add(4,7)   //11
    .addOne(4)  
        (5)     //9
        (6)     //10
        (7)     //11
    .addEnd(11,10)  //chain ended here
    .add(42,1)  //❌error, chain function break
```

<!--mds:cn-->
扩展时，根据根据方法返回类型不同，会生成不同的链式方法
| 返回值类型 |undefined/void | function | 其他类型 |
| --- | --- | --- | -- |
| 修改()操作 | 否 | function设置为()操作 | 否 |
| 终止链式反应 | 否 | 否 | 是 |

但是()操作的返回不论是什么类型都不会再次修改()操作
<!--mds:en-->

When extending the library, different chainable methods will be generated based on the return type of the methods.
| Return Types | `undefined / void` | `function` | other types |
| --- | --- | --- | -- |
| modify the `()` operation | No | set function to `()` operation | No |
| terminate the chain | No | No | No |

But the `()` operation does not change `()` operation itself regardless of its return type.
<!--mds:end-->

<!--mds:cn-->
#### 扩展实例方法

在扩展方法里面，你也许需要调用`ChainCore`已经扩展的方法或者`ChainCore`自有的方法，在这种方法中，你需要在入口参数中增加一个`ChainCore`的引用。
`ChainCore`提供了一个方法来扩展这种方法，并在该方法被调用时自动传入`ChainCore`实例，我们把这种方法称为`实例方法`

扩展方法举例
<!--mds:en-->
### 🔗Extending Instance Methods

In the process of extending methods, you may need to call methods that have already been extended by `ChainCore` or methods that are inherent to `ChainCore`. In such methods, you need to add a reference to `ChainCore` instance in the entry parameters.
`ts-chain-core` provides a method for extending these methods and automatically passing in the `ChainCore` instance when the method is called. We refer to these methods as **instance methods**.

Example of Extending Methods
<!--mds:end-->



```ts
ChainCore(null).extendFunctionsFromObject({
    sayHello: (name: string) => {
        console.log(`hello,${name}`);
    },
}).extendInstanceFunctions({
    /**
     * play a scenario
     * @param ch passed by `ChainCore` and reference to itself
     * @param time 
     * @param place 
     * @param to 
     */
    play(ch,time:string,place:string,to:string){
        console.log(`This is ${time},${place}`);
        ch.sayHello(to)
    }
}).play('morning','garden','🍓')
```

<!--mds:cn-->
扩展`实例方法`里的第一个入口参数，要预留给`ts-chain-core`，它不用标注类型，在调用时不用传入
<!--mds:en-->
When extending `instance methods`, the first entry parameter should be reserved for `ts-chain-core`. It does not need to be annotated with a type, and does not have to be passed in when called.
<!--mds:end-->




```ts
ChainCore(null).extendFunctionsFromObject({
    sayHello: (name: string) => {
        console.log(`hello,${name}`);
    },
}).extendInstanceFunctions({
    /**
     * play a scenario
     * @param ch passed by `ChainCore` and reference to itself
     * @param fn play anything you wanted in this function
     */
    play(ch,fn:(ch:CurrentStateChainRef)=>void){
        fn.apply(null,[ch]);
    }
}).play((ch)=>{
    console.log(`This is morning,garden`);
    ch.sayHello('🍓')
})        
```
<!--mds:cn-->
回调函数中的第一个参数标注为`CurrentStateChainRef`类型，在调用时，传入的ChainCore将自动获得此前之前扩展方法的代码提示。

实例方法同样可以设置()操作，()操作中同样也可以使用回调访问`ChainCore`实例
<!--mds:en-->
The first parameter in the callback function should be annotated with the `CurrentStateChainRef` type. When called, the passed-in `ChainCore` instance will automatically receive code hints for previously extended methods.

`Instance methods` can also have the `()` operation set, and callbacks can use it to access the `ChainCore` instance.
<!--mds:end-->

```ts
ChainCore(null).extendFunctionsFromObject({
    sayHello: (name: string) => {
        console.log(`hello,${name}`);
    },
}).extendInstanceFunctions({
    play(ch){
        return (fn:(ch:CurrentStateChainRef,time:string,place:string,to:string)=>void,time:string,place:string,to:string)=>{
            fn.apply(null,[ch,time,place,to]);
        }
    }
}).play()((ch,time,place,to)=>{
    console.log(`This is ${time},${place}`);
    ch.sayHello(to)
},'morning','garden','🍓');
```

<!--mds:cn-->
**限制注意**📢📢 *回调函数中的`ChainCore`实例是由扩展方法自身传入的，你可以不必在第一位传入`ChainCore`实例，但是我们约定只有在第一位的参数类型标注为`CurrentStateChainRef`，才会转换成当前的`ChainCore`类型*

<!--mds:en-->
**Attention** 📢📢 *It is important to note that the `ChainCore` instance in the callback function is passed in by the extended method itself. You do not need to pass the `ChainCore` instance as the first parameter, but it is convention to annotate the type of the first parameter as `CurrentStateChainRef` so that it is properly recognized as the `ChainCore` type.*

<!--mds:end-->


<!--mds:cn-->
##### 📑类型自动转换

`ts-chain-core`通过类型映射技术(remapping)来实现类型自动转换，以提供方便的自动补全功能，`CurrentStateChainRef`是一个例子。在后面还会看到更多例子。

然而该技术存在一定局限性。首先，当前`typescript`存在的限制，让所有的参数都实现自动转换是不切实际的，在保证使用和运算量之间做了权衡，该功能目前只能提供给函数返回类型和入参的前四个。在绝大多数情况下，这是够用的。

另外`remapping`也不支持泛型映射，但`ts-chain-core`提供了一套解决方案，后面会提到。
<!--mds:en-->
##### 📑Type Remapping

`ts-chain-core` uses type remapping to achieve automatic type conversions for convenient auto-completion features. `CurrentStateChainRef` is one example of this. More examples will be discussed later.

However, there are limitations to this technique. Firstly, due to restrictions in `TypeScript`, it is not practical to automate type conversions for all parameters. To strike a balance between usability and computational overhead, this feature currently only supports the automatic conversion of the return type and the first four parameters. In the majority of cases, this is sufficient.

Additionally, remapping does not support generic mappings. However, ts-chain-core provides a solution for this, which will be discussed later.
<!--mds:end-->




<!--mds:cn-->
##### 🔍ChainCore类型声明

由于`ChainCore`是一个比较复杂的类型，但有时候的你的代码中需要声明扩展了某些方法的`ChainCore`类型，在绝大多数情况下，直接书写`ChainCore`类型是不被推荐的，因为过于复杂。这里推荐用类型推导的方式来进行声明
<!--mds:en-->
##### 🔍Declaring ChainCore Types

Since `ChainCore` is a complex type, there may be situations where you need to declare the `ChainCore` type with certain methods extended. In most cases, directly writing the `ChainCore` type is not recommended due to its complexity. Instead, it is recommended to use type inference to declare the type.
<!--mds:end-->

```ts
//声明示例
function chainFactory(){
    return ChainCore(null).extendFunctionsFromObject({
                sayHello: (name: string) => {
                    console.log(`hello,${name}`);
                },
                //some other functions
            })
}

type MyChainType = ReturnType<typeof chainFactory>;

function myFunction(ch:MyChainType){
    ch.sayHello('')
}
```



<!--mds:cn-->
#### 🔍`thisArg`

`thisArg`是`ChainCore`的内置变量，用于设置运行方法中的this

它可以通过`ChainCore()`传入，也可以通过`getThis()`和`setThis()`在运行中修改和访问
<!--mds:en-->
#### 🔍`thisArg`

`thisArg` is a built-in variable in `ChainCore` that is used to set the `this` value in the running methods.

It can be passed through `ChainCore()`, or accessed and modified during runtime using `getThis() `and `setThis()`.
<!--mds:end-->


#### `arguments cache`
<!--mds:cn-->

为了避免重复的输入，`ts-chain-core`的运行时缓存了上一次调用的参数，参数不传入或传入undefined时，`ChainCore`会传入上一次传入的值作为替代
<!--mds:en-->

To avoid repetitive input, `ChainCore` caches the arguments from the previous call at runtime. If no arguments are passed or if `undefined` is passed, `ChainCore` will use the values from the previous call as substitutes.
<!--mds:end-->

```ts
UIKit(this)
    .show()
        ('myUsernameEditor',props.mode==='edit')  //show these controls when user need edit
        ('myAddressEditor')
        ('myEmailEditor')
        ('myPhotoEditBtn')
        ('myUsernameLabel',props.mode==='view')  //show these controls when just read
        ('myAddressLabel')
        ('myEmailLabel')
```

<!--mds:cn-->
在大多数场合下，这个特性确实很有帮助，但是在有些场合，它可能会产生一些令人困惑的结果，并让人误认为是程序的bug
<!--mds:en-->
In most cases, this feature is helpful. However, in some situations, it may lead to confusing results and mistakenly be seen as a bug in the program.
<!--mds:end-->

```ts
ChainCore(null)
    .extendInstanceFunctions({
        log(ch,...args:any){
        console.log(...args)
        }
    })
    //confused output
    .log('a','b','c')                 // stdout: a b c
    .log('d')                         // stdout: d b c  
    .log(undefined,'e',undefined)     // stdout: d e c
```
<!--mds:cn-->
`ts-chain-core`提供了`clearArgCache()`方法用于清空上一次的缓存
<!--mds:en-->
`ts-chain-core` provides the `clearArgCache()` method to clear the cache from the previous call. 
<!--mds:end-->

```ts
//proper version
ChainCore(null)
    .extendInstanceFunctions({
        log(ch,...args:any){
        ch.clearArgCache();
        console.log(...args)
        }
    })
    .log('a','b','c')                 // stdout: a b c
    .log('d')                         // stdout: d 
    .log(undefined,'e',undefined)     // stdout:  e 
```

<!--mds:cn-->
你也可以在调用它来清除潜在的内存泄露
<!--mds:en-->
You can also call it to clear potential memory leaks.
<!--mds:end-->

```ts
const persistChainInstance =  ChainCore(null)
    .extendInstanceFunctions({
        on(ch,obj:any,eventName:string,fun:Function){
            ch.clearArgCache(); //prevent fun be cached
            obj.addEventListener(eventName,fun)
        }
    })

```

<!--mds:cn-->
##### 访问`cache arguments`
<!--mds:en-->
##### Visit `cache arguments`
<!--mds:end-->

```ts
ChainCore(null)
    .setFunction((...args:any[])=>console.log(...args))
        ('a really really really really long expression') //a really really really really long expression
        (CacheValue(x=>'🎄'+x+'🎄')) //🎄a really really really really long expression🎄
        (CacheValue(x=>'✨'+x+'✨'))  //✨🎄a really really really really long expression🎄✨
```


<!--mds:cn-->
#### 批量调用方法

`ts-chain-core`提供了两个批量调用()操作的方法，请看示例
<!--mds:en-->
#### Batch Operations

`ts-chain-core` provides two methods for batch `()`operations.
<!--mds:end-->

```ts
ChainCore(null)
    .setFunction((m: number, n?: number) => {
        console.log(Math.pow(m, n || 0));
    })
    .batch([3, 4], [1, 2], [5, 6], [1], [2], [3]);

ChainCore(null)
    .setFunction((m: number, n?: number) => {
        console.log(Math.pow(m, n || 0));
    })
    .zipBatch([1, 2, 3, 4, 5, 6], [2]);
    //equal to 
    .batch([1,2],[2],[3],[4],[5],[6]);

```
<!--mds:cn-->
批量调用仍然遵循参数缓存原则
<!--mds:en-->
Batch operations still follow the argument caching rules.
<!--mds:end-->

<!--mds:cn-->
#### 扩展运行时

`ChainCore`的运行时除了`thisArg`和`arguments cache`之外，还运行使用者进行扩展，扩展的属性通过`runtime`接口进行访问
<!--mds:en-->
### 🔗Extending the Runtime

In addition to `thisArg` and the `arguments cache`, the runtime of `ChainCore` can be extended by the user. The extended properties can be accessed through the runtime interface.
<!--mds:end-->

```ts
const ch = ChainCore(null)
    .extendRuntime<{value:string}>()  //extend a field names `value`
    .extendInstanceFunctions({
        setValue(ch,value:string){
            ch.runtime.value = value;   //write to value
        },
        getValue(ch){
            return ch.runtime.value;   //access value
        }
    });
const result = ch.setValue('hello').getValue();
console.log(result) //hello
```

<!--mds:cn-->
这里有一个例子简单的实现模拟 `JQuery` 的功能.
<!--mds:en-->
Here is an simple example that mimics `JQuery`.
<!--mds:end-->

```ts
import { ChainCore, CurrentStateChainRef } from "ts-chain-core";

type QueryType = string | Document | HTMLElement | EventTarget | null;

const getQuery = (q: QueryType) => {
  if (q === null || q === undefined) return document.body;
  if (typeof q === "string") {
    return document.querySelector(q) as HTMLElement;
  } else return q as HTMLElement;
};
const $ = (q: QueryType) => {

  return ChainCore(null)
    .extendRuntime<{ dom: HTMLElement }>()
    .extendInstanceFunctions({
      ready(ch, fn: () => void) {
        ch.runtime.dom.addEventListener("DOMContentLoaded", fn);
      },
      click(ch, fn: (ch: CurrentStateChainRef, event: MouseEvent) => void) {
        ch.runtime.dom.onclick = (event: MouseEvent) => fn(ch, event);
      },
      addClass(ch, className: string) {
        ch.runtime.dom.classList.add(className);
      },
      removeClass(ch, className: string) {
        ch.runtime.dom.classList.remove(className);
      },
      show(ch) {
        ch.runtime.dom.style.display = "";
      },
      hide(ch) {
        ch.runtime.dom.style.display = "none";
      },
      text(ch, str: any) {
        ch.runtime.dom.textContent = str;
      },
      query(ch, q: QueryType) {
        ch.runtime.dom = getQuery(q);
      },
    })
    .query(q);
};

$(document).ready(() => {
  $(".button")
    .extendRuntime({
      clicked: false,
    })
    .click((ch, event) => {
      ch.runtime.clicked = !ch.runtime.clicked;
      if (ch.runtime.clicked) {
        $(event.currentTarget)
          .addClass("clicked")
          .query("h2")
          .hide()
          .query("h1")
          .text("Hello, Chain!")
          .show();
      } else {
        $(event.currentTarget)
          .removeClass("clicked")
          .query("h2")
          .show()
          .query("h1")
          .hide();
      }
    });
});
```
<!--mds:cn-->
你可以 [直接在web上运行它](https://codesandbox.io/p/github/maxzhou0/ts-chain-core-web-demo/main?file=%2Fsrc%2Fmain.ts)
<!--mds:en-->
You can [try running it on the web](https://codesandbox.io/p/github/maxzhou0/ts-chain-core-web-demo/main?file=%2Fsrc%2Fmain.ts)

<!--mds:end-->

<!--mds:cn-->
#### 🚀扩展运行时类型动态修改和指向

在一些应用中，无法事先确认数据的具体类型，比如，你要做一个对数组进行操作的函数库，
在定义方法的时候，无法指明需要操作的类型 （*这要求泛型参数能够动态调整，这一点对于目前的`typescript`来说是做不到的*）*。`ts-chain-core`提供了引用扩展运行时类型的方法`ReferTo<>`和动态修改运行时类型的方法`ChangeChainRuntime<,>`来达成目的，请看例子
<!--mds:en-->
#### 🚀Dynamically Modifying and Referencing Runtime Type

In some applications, it is not possible to predict the exact type of data in advance. For example, if you are creating a function library that operates on arrays, you cannot specify the exact type when defining the methods. This requires dynamic adjustment of generic parameters, which is currently not supported in `TypeScript`. `ts-chain-core` provides the `ReferTo<>` type to reference runtime types and the `ChangeChainRuntime<,>` type to dynamically modify runtime types.
<!--mds:end-->

```ts

const ch = ChainCore(null)
    .extendRuntime<{group:any[]}>()
    .extendInstanceFunctions({
        /**
         * 
         * @param ch 
         * @param value ReferTo<'<0>'> which means use the first generic type as input type
         * @returns ChangeChainRuntime<'group','<0>'> means change runtime `group' type to first generic type
         */
        group(ch,value:ReferTo<'<0>'>):ChangeChainRuntime<'group','<0>'>{
            ch.runtime.group = value;
            return ChangeRuntimeReturn();  //call this function to actually change runtime type
        },
        setToIndex(ch,value:ReferTo<'group[number]'>,index:number){
            ch.runtime.group[index] = value;
        },
        each(ch,fn:(item:ReferTo<'group[number]'>,index?:number)=>void){
            ch.runtime.group.forEach(fn);
        }
    });
ch.group([0,1,2,3]) //group<number[]> will change  setToIndex and each's function parameter type to number
    .setToIndex(42,0)
    //.setToIndex('42',0)  ❌error,'42' doesn't match type number
    .each((item,index)=>{
        console.log(index,item)
    })  //output : 42,1,2,3

```

<!--mds:cn-->
你可能注意到，其实每个`ts-chain-core`扩展的方法都是泛型方法，泛型参数有四个，可以通过`ReferTo<'<0>'>`,`ReferTo<'<1>'>`,`ReferTo<'<2>'>`,`ReferTo<'<3>'>`来实现动态修改类型的目的，返回时用到`ChangeChainRuntime`则是用来修改运行参数的类型的。
<!--mds:en-->
You may have noticed that every extension method in `ts-chain-core` is actually a generic method with four type parameters. You can use `ReferTo<'<0>'>`, `ReferTo<'<1>'>`, `ReferTo<'<2>'>`, and `ReferTo<'<3>'>` to dynamically modify types, and use `ChangeChainRuntime<,>` to modify runtime type parameters.
<!--mds:end-->

<!--mds:cn-->
##### 🚀`ReferTo<>`语法

ReferTo<`T[]`>表示它是类型T的数组类型
ReferTo<`T[number]`> 表示它是类型T的数组元素类型.*前提T必须是一个数组类型否则会得到错误类型提示*
ReferTo还可以用路径符号`::`来表示一个复杂类型下面的某个属性的类型
下面是举例（此例仅做展示，并不表示一定需要用`ReferTo<>`来指向一个类型，除非它是一个需要用泛型来表达的类型）
<!--mds:en-->
##### 🚀`ReferTo<>`Syntax

ReferTo<`T[]`> means it is an array type of type `T`.
ReferTo<`T[number]`> means it is an array element type of type `T`. (*Note: `T` must be an array type, or you will get a type error.*)
You can also use the path symbol `::` to represent the type of a property in a complex type.
Here is an example (*this is just for demonstration purposes and does not necessarily mean you need to use `ReferTo<>` to refer to a type, unless it's a type that needs to be expressed using generics*).
<!--mds:end-->

```ts
ChainCore(null).extendRuntime<{
        actor:{
            name:string,
            birthDate:Date,
            movie:{
                title:string,
                year:number,
                genre:[{id:number,key:string,name:string}]
            }[]
        }
    }>()
    .setFunction((input:ReferTo<'actor::movie[number]::genre[number]'>)=>{
        console.log((input as any).name)
    })
    ({id:1,key:'comedy',name:'comedy'})
```

<!--mds:cn-->
##### 🚀多个扩展类型组合

使用`ReMapTo<>`将多个扩展运行时的属性的类型组合成一个新的类型
<!--mds:en-->
##### 🚀 `Combining Multiple Extension Types`

Use `ReMapTo<>` to combine the types of multiple extension runtime attributes into a new type.
<!--mds:end-->
```ts
const v = ChainCore(null)
    .extendRuntime<{name:string,age:number}>()
    .extendInstanceFunctions({
        setPerson(ch,values:ReMapTo<'name'|'age'>){
            ch.runtime.age = (values as any).age;
            ch.runtime.name = (values as any).name;
        },
        getPerson(ch):ReMapTo<'name'|'age'>{
            return {...ch.runtime} as any;
        }
    })
    .setPerson({name:'Amy',age:42})
    .getPerson().name;
console.log(v) //Amy
```