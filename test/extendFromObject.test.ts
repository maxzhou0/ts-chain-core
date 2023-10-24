import { ChainCore } from "../src/index";
import { testSuite } from "./TestUtils";

testSuite("extendFromObject", {
  "create chain functions": [
    () => {
      ChainCore(null)
        .extendFunctionsFromObject({
          sayHello: (name: string) => {
            console.log(`hello,${name}`);
          },
        })
        .sayHello("🍊")
        .sayHello("🍇")
        .setFunction("sayHello")("🍉")("🍍")("🥭");
    },
    ["hello,🍊", "hello,🍇", "hello,🍉", "hello,🍍", "hello,🥭"],
  ],
  "create call chain functions": [
    () => {
      ChainCore(null)
        .extendFunctionsFromObject({
          greeting: (from: string) => {
            return (to: string) => {
              console.log(`${from} greeting to ${to}`);
            };
          },
        })
        .greeting("🍎")("🍋")("🍌")
        .greeting("🍌")("🍎")("🍋")
        .greeting("🍋")("🍌")("🍎");
    },
    [
      "🍎 greeting to 🍋",
      "🍎 greeting to 🍌",
      "🍌 greeting to 🍎",
      "🍌 greeting to 🍋",
      "🍋 greeting to 🍌",
      "🍋 greeting to 🍎",
    ],
  ],
  "create end chain functions": [
    () => {
      const result = ChainCore(null)
        .extendFunctionsFromObject({ answer: () => 42 })
        .answer();
      console.log(result.toFixed(2));
    },
    ["42.00"],
  ],
  "extend from object test thisArgs": [
    () => {
      const obj = {
        answer: 42,
        printAnswer() {
          console.log(this.answer.toFixed(2));
        },
      };
      ChainCore(obj).extendFunctionsFromObject(obj).printAnswer();
    },
    ["42.00"],
  ],
  "test arguments cache": [
    () => {
      ChainCore(null)
        .extendFunctionsFromObject({
          /**
           * speaker say sth to some one;
           * @param speaker who
           * @returns
           */
          say(speaker: string) {
            return (to: string, words?: string) => {
              console.log(`${speaker} said to ${to}: ${words}`);
            };
          },
        })
        .say("🍑")(
        "🍒",
        "hi!"
      )("🍓")("🥝");
    },
    ["🍑 said to 🍒: hi!", "🍑 said to 🍓: hi!", "🍑 said to 🥝: hi!"],
  ],
  "test arguments cache clean": [
    () => {
      ChainCore(null)
        .extendFunctionsFromObject({
          say(speaker: string) {
            return (to: string, words?: string) => {
              console.log(`${speaker} said to ${to}: ${words}`);
            };
          },
        })
        .say("🍑")(
          "🍒",
          "hi!"
        )("🍓")("🥝")
        .clearArgCache()
        .say("🍈")("🍅");
    },
    [
      "🍑 said to 🍒: hi!",
      "🍑 said to 🍓: hi!",
      "🍑 said to 🥝: hi!",
      "🍈 said to 🍅: undefined",
    ],
  ],
  "test arguments cache clean2": [
    () => {
      ChainCore(null)
        .extendInstanceFunctions({
          log(ch,...args:any){
            console.log(...args)
          }
        })
        .log('a','b','c')                 // stdout: a b c
        .log('d')                         // stdout: d b c  
        .log(undefined,'e',undefined)     // stdout: d e c
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
    },
    [
      'a b c','d b c','d e c','a b c','d'," e "
    ],
  ],
  "() return test": [
    () => {
      class Example {
        toChain() {
          return ChainCore(this).extendFunctionsFromObject(Example);
        }
        add(a: number) {
          return (b: number) => {
            console.log(a + b);
          };
        }
        addV2(a: number) {
          return (b: number) => {
            const c = a + b;
            console.log(c);
            return c;
          };
        }
        addV3(a:number){
          return (b:number)=>{
            return (c:number)=>{
              console.log(a+b+c)
            }
          }
        }
      }

      new Example().toChain()
        .add(4)(5)(6)(7)
        .addV2(3)(4)(5)
        .addV3(3)(4)(5);
    },
    ['9','10','11','7','8'],
  ],
});
