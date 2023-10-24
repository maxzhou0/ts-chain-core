import { ChainCore } from "../src/ChainCore";
import { testSuite } from "./TestUtils";
import { CurrentStateChainRef } from '../src/Chain-types';

testSuite("extend Instance Functions", {
    "create instance function":[()=>{
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
    },["This is morning,garden","hello,🍓"]],
    "instance callback function":[()=>{
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
    },["This is morning,garden","hello,🍓"]],
    "instance chain callback function":[()=>{
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
        },'morning','garden','🍓')
    },["This is morning,garden","hello,🍓"]]
  });
  


