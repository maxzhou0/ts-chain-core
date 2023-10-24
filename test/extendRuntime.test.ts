import { ChangeChainRuntime, ReMapTo, ReferTo } from '../src/Chain-types';
import { ChangeRuntimeReturn, ChainCore } from "../src/ChainCore";
import { testSuite } from "./TestUtils";

testSuite("extend Instance Functions", {
    "add runtime field":[()=>{
      const ch = ChainCore(null)
        .extendRuntime<{value:string}>()
        .extendInstanceFunctions({
          setValue(ch,value:string){
            ch.runtime.value = value;
          },
          getValue(ch){
            return ch.runtime.value;
          }
      });
      const result = ch.setValue('hello').getValue();
      console.log(result)
    },['hello']],
    "alter runtime field type and  refer runtime field type":[()=>{
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
            return ChangeRuntimeReturn();
          },
          /**
           * 
           * @param ch 
           * @param value ReferTo<'group[number]'> means use extended field  group:T[]'s T as input type
           * @param index 
           */
          setToIndex(ch,value:ReferTo<'group[number]'>,index:number){
            ch.runtime.group[index] = value;
          },
          each(ch,fn:(item:ReferTo<'group[number]'>,index?:number)=>void){
            ch.runtime.group.forEach(fn);
          }
      });
      ch.group([0,1,2,3]).setToIndex(42,0).each((item,index)=>{
        console.log(index,item)
      })
    },[ "0 42", "1 1", "2 2", "3 3"]],
    "refer runttime filed type by path":[()=>{
      ChainCore(null).extendRuntime<{
        actor:{
        name:string,
        birthDate:Date,
        movie:{
          title:string,
          year:number,
          genre:[{id:number,key:string,name:string}]
        }[]
      }}>().setFunction((input:ReferTo<'actor::movie[number]::genre[number]'>)=>{
        console.log((input as any).name)
      })
      ({id:1,key:'comedy',name:'comedy'})
    },['comedy']],
    "infer multiple runtime fields type to arugments":[()=>{
      const v = ChainCore(null).extendRuntime<{name:string,age:number}>().extendInstanceFunctions({
        setPerson(ch,values:ReMapTo<'name'|'age'>){
          ch.runtime.age = (values as any).age;
          ch.runtime.name = (values as any).name;
        },
        getPerson(ch):ReMapTo<'name'|'age'>{
          return {...ch.runtime} as any;
        }
      }).setPerson({name:'Amy',age:42}).getPerson().name;
      console.log(v)
    },['Amy']],

  });
  


