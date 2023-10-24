import { expect } from "chai";
import { describe, it } from "mocha";


function setupConsoleLogRedirect() {
  const logs: any[] = [];
  const oldConsoleLog = console.log;
  beforeEach(() => {
    console.log = (...args: any[]) => {
      logs.push(args.join(" "));
      oldConsoleLog.apply(console, args);
    };
  });

  afterEach(() => {
    console.log = oldConsoleLog;
    logs.length = 0;
  });

  return logs;
}

export const testSuite = (suiteName: string, units:Record<string,[()=>any,any[]]|null|undefined>,...args:any) => {
    describe(suiteName,()=>{

        const logs = setupConsoleLogRedirect();
        Object.keys(units).forEach(desc=>{
            if(!units[desc]) return;
            // if(suiteName!=='miscFunctionTest') return;
            it(desc,()=>{
                units[desc]![0]();
                expect(logs).to.deep.equal(units[desc]![1])
            })
        })
    })
};


