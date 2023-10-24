import { ReferTo } from "../src/Chain-types";
import { ChainCore } from "../src/ChainCore";
import { testSuite } from "./TestUtils";

testSuite("miscFunctionTest", {
  "clone function": [
    () => {
      const ch = ChainCore(null).extendRuntime({
        canClone: { deep: 42 },
      });
      const ch2 = ch.clone(true);
      const ch3 = ch.clone();
      ch.runtime.canClone.deep = 43;
      console.log(ch.runtime.canClone.deep);
      console.log(ch2.runtime.canClone.deep);
      console.log(ch3.runtime.canClone.deep);
    },
    ["43", "42", "43"],
  ],
  "batch function": [
    () => {
      ChainCore(null)
        .setFunction((m: number, n?: number) => {
          console.log(Math.pow(m, n || 0));
        })
        .batch([3, 4], [1, 2], [5, 6], [1], [2], [3]);
    },
    ["81", "1", "15625", "1", "64", "729"],
  ],
  "zip batch function": [
    () => {
      ChainCore(null)
        .setFunction((m: number, n?: number) => {
          console.log(Math.pow(m, n || 0));
        })
        .zipBatch([1, 2, 3, 4, 5, 6], [2]);
    },
    ["1", "4", "9", "16", "25", "36"],
  ],
  "inter runtime to generic": [
    () => {
      const ch = ChainCore(null).extendFunctionsFromObject({
        find(
          values: ReferTo<"<0>">,
          fn: (item: ReferTo<"<0>", "[number]">) => boolean
        ): ReferTo<"<0>", "[number]"> {
          return values.find(fn as any) as any;
        },
      });
      const result = ch.find<{ name: string; age: number }[]>(
        [
          { name: "Amy", age: 42 },
          { name: "Lihua", age: 43 },
        ],
        (item) => item.age === 43
      );
      console.log(result?.name);
    },
    ["Lihua"],
  ],
  "change thisArg": [
    () => {
      ChainCore(42)
        .setInstanceFunction((ch) => {
          console.log(ch.getThis());
        })()
        .setThis("🍇")();
    },
    ["42", "🍇"],
  ],
  "extend from class":[
  () => {
    class Example {
      toChain() {
        return ChainCore(this).extendFunctionsFromObject(Example)
      }
      add(a: number, b: number) {
        console.log(a + b);
      }
      addOne(a: number) {
        return (b: number) => {
          console.log(a + b);
        };
      }
      addEnd(a: number, b: number) {
        return a + b;
      }
    }

    new Example()
      .toChain()
      .add(3, 5)
      .add(4, 7)
      .addOne(4)(5)(6)(7)
      .addEnd(11, 10);
  },
  ["8", "11", "9", "10", "11"],
],
  "extend from class instance": [
    () => {
  
      class Example {
        toChain() {
          return ChainCore(this).extendFunctionsFromObject(this as Example);
        }
        add(a: number, b: number) {
          console.log(a + b);
        }
        addOne(a: number) {
          return (b: number) => {
            console.log(a + b);
          };
        }
        addEnd(a: number, b: number) {
          return a + b;
        }
      }

      new Example()
        .toChain()
        .add(3, 5)
        .add(4, 7)
        .addOne(4)(5)(6)(7)
        .addEnd(11, 10);
    },
    ["8", "11", "9", "10", "11"],
  ],
});
