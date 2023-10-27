<p align="center">
  <img src="./docs/img/title.png" style="transition: all 2.5s ease;" onmouseover="this.style.filter='hue-rotate(-80deg)'"  onmouseout="this.style.filter=''" width="400" />
</p>
<p align='center'>
  <a style="color:#D437B5;transition: all 0.5s ease;" onmouseover="this.style.color='#0069D3'"
    onmouseout="this.style.color='#D437B5'" href='./README.en.md'>English</a> | 简体中文 
</p>

# ts-chain-core

这是一个typescript链式编程的基础库，从随手编写的小工具到称手的工具集合都可以用它来完成

### 特性

- 用最小的代码就能实现链式编程
- 节省代码量：在一些场合中，使用本库编写的工具可以使实际代码量减少一半甚至更多
-  **💥💥扩展接口自动补全** 无需事先定义你撰写的接口，即可在书写过程中获得代码补全！下面是实际效果展示（环境：vscode，无特殊插件）
![image](./docs/img/screenshot-1.gif)
- **🌈上手简单** 你只要掌握三个核心的api就可以编写出满足大部分需求的链式接口。
- **🚀小巧** 程序本体压缩后仅`3kb`大小。


### 快速开始

#### 安装

```shell
npm i ts-chain-core
```
####基本用法

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

#### 将类方法直接转换成链式方法

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


扩展时，根据根据方法返回类型不同，会生成不同的链式方法
| 返回值类型 |undefined/void | function | 其他类型 |
| --- | --- | --- | -- |
| 修改()操作 | 否 | function设置为()操作 | 否 |
| 终止链式反应 | 否 | 否 | 是 |

但是()操作的返回不论是什么类型都不会再次修改()操作

#### 扩展实例方法

在扩展方法里面，你也许需要调用`ChainCore`已经扩展的方法或者`ChainCore`自有的方法，在这种方法中，你需要在入口参数中增加一个`ChainCore`的引用。
`ChainCore`提供了一个方法来扩展这种方法，并在该方法被调用时自动传入`ChainCore`实例，我们把这种方法称为`实例方法`

扩展方法举例

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

扩展`实例方法`里的第一个入口参数，要预留给`ts-chain-core`，它不用标注类型，在调用时不用传入

#### 扩展方法中的回调

你也许需要在扩展方法中的回调中访问`ChainCore`的方法，以下是上一个例子的不同的实现方式

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
回调函数中的第一个参数标注为`CurrentStateChainRef`类型，在调用时，传入的ChainCore将自动获得此前之前扩展方法的代码提示。

实例方法同样可以设置()操作，()操作中同样也可以使用回调访问`ChainCore`实例

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

**限制注意**📢📢 *回调函数中的`ChainCore`实例是由扩展方法自身传入的，你可以不必在第一位传入`ChainCore`实例，但是我们约定只有在第一位的参数类型标注为`CurrentStateChainRef`，才会转换成当前的`ChainCore`类型*



##### 📑类型自动转换

`ts-chain-core`通过类型映射技术(remapping)来实现类型自动转换，以提供方便的自动补全功能，`CurrentStateChainRef`是一个例子。在后面还会看到更多例子。

然而该技术存在一定局限性。首先，当前`typescript`存在的限制，让所有的参数都实现自动转换是不切实际的，在保证使用和运算量之间做了权衡，该功能目前只能提供给函数返回类型和入参的前四个。在绝大多数情况下，这是够用的。

另外`remapping`也不支持泛型映射，但`ts-chain-core`提供了一套解决方案，后面会提到。




##### 🔍ChainCore类型声明

由于`ChainCore`是一个比较复杂的类型，但有时候的你的代码中需要声明扩展了某些方法的`ChainCore`类型，在绝大多数情况下，直接书写`ChainCore`类型是不被推荐的，因为过于复杂。这里推荐用类型推导的方式来进行声明

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



#### 🔍`thisArg`

`thisArg`是`ChainCore`的内置变量，用于设置运行方法中的this

它可以通过`ChainCore()`传入，也可以通过`getThis()`和`setThis()`在运行中修改和访问


#### `arguments cache`

为了避免重复的输入，`ts-chain-core`的运行时缓存了上一次调用的参数，参数不传入或传入undefined时，`ChainCore`会传入上一次传入的值作为替代

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

在大多数场合下，这个特性确实很有帮助，但是在有些场合，它可能会产生一些令人困惑的结果，并让人误认为是程序的bug

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
`ts-chain-core`提供了`clearArgCache()`方法用于清空上一次的缓存

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

你也可以在调用它来清除潜在的内存泄露

```ts
const persistChainInstance =  ChainCore(null)
    .extendInstanceFunctions({
        on(ch,obj:any,eventName:string,fun:Function){
            ch.clearArgCache(); //prevent fun be cached
            obj.addEventListener(eventName,fun)
        }
    })

```

##### 访问`cache arguments`

```ts
ChainCore(null)
    .setFunction((...args:any[])=>console.log(...args))
        ('a really really really really long expression') //a really really really really long expression
        (CacheValue(x=>'🎄'+x+'🎄')) //🎄a really really really really long expression🎄
        (CacheValue(x=>'✨'+x+'✨'))  //✨🎄a really really really really long expression🎄✨
```


#### 批量调用方法

`ts-chain-core`提供了两个批量调用()操作的方法，请看示例

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
批量调用仍然遵循参数缓存原则

#### 扩展运行时

`ChainCore`的运行时除了`thisArg`和`arguments cache`之外，还运行使用者进行扩展，扩展的属性通过`runtime`接口进行访问

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

#### 🚀扩展运行时类型动态修改和指向

在一些应用中，无法事先确认数据的具体类型，比如，你要做一个对数组进行操作的函数库，
在定义方法的时候，无法指明需要操作的类型 （*这要求泛型参数能够动态调整，这一点对于目前的`typescript`来说是做不到的*）*。`ts-chain-core`提供了引用扩展运行时类型的方法`ReferTo<>`和动态修改运行时类型的方法`ChangeChainRuntime<,>`来达成目的，请看例子

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

你可能注意到，其实每个`ts-chain-core`扩展的方法都是泛型方法，泛型参数有四个，可以通过`ReferTo<'<0>'>`,`ReferTo<'<1>'>`,`ReferTo<'<2>'>`,`ReferTo<'<3>'>`来实现动态修改类型的目的，返回时用到`ChangeChainRuntime`则是用来修改运行参数的类型的。

##### 🚀`ReferTo<>`语法

ReferTo<`T[]`>表示它是类型T的数组类型
ReferTo<`T[number]`> 表示它是类型T的数组元素类型.*前提T必须是一个数组类型否则会得到错误类型提示*
ReferTo还可以用路径符号`::`来表示一个复杂类型下面的某个属性的类型
下面是举例（此例仅做展示，并不表示一定需要用`ReferTo<>`来指向一个类型，除非它是一个需要用泛型来表达的类型）

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

##### 🚀多个扩展类型组合

使用`ReMapTo<>`将多个扩展运行时的属性的类型组合成一个新的类型
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