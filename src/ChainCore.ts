import {
  ChainRefInit,
  ExtendFunction,
  FUNCTION_MODEL_TYPE_INSTANCE,
  FUNCTION_MODEL_TYPE_NONE,
} from "./Chain-types";

export const ChangeRuntimeReturn = () => undefined as any;

export const ChainCore = (thisArg?: any): ChainRefInit => {
  const instance = ((...args: any) => {
    const f = instance.__chainRef__runtime.__function;
    if (!f) return instance;
    const execFun: ExtendFunction =
      typeof f === "string"
        ? (instance.__chainRef__runtime.__functions as any)[f]
        : f;
    return callFunc(true, execFun, ...args);
  }) as ChainRefInit;

  const callFunc = (
    noRedirection: boolean,
    f: ExtendFunction,
    ...args: any[]
  ) => {
    instance.__chainRef__runtime.__argsCache.splice(
      0,
      args.length,
      ...args.map((x, index) =>
        x === undefined ? instance.__chainRef__runtime.__argsCache[index] : x
      )
    );
    const model = f.__modelType;
    const cache = instance.__chainRef__runtime.__argsCache;
    const result = (() => {
      if (model === "INSTANCE") {
        return f.call(
          instance.getThis(),
          instance,
          ...instance.__chainRef__runtime.__argsCache
        );
      } else return f.call(instance.getThis(), ...cache);
    })();
    if (noRedirection) return instance;
    if (typeof result === "function") {
      instance.setFunction(result);
      return instance;
    } else if (result === undefined) {
      return instance;
    } else {
      return result;
    }
  };
  const wrapCallFunc = (f: ExtendFunction) => {
    return (...args: any) => {
      return callFunc(false, f, ...args);
    };
  };
  instance.__chainRef__runtime = {
    __thisArg: thisArg,
    __function: null as any,
    __functions: {},
    __argsCache: [],
    __extended: {},
  };

  instance.clone = (deepClone?: boolean) => {
    const newInstance = ChainCore(null);
    const newRT = newInstance.__chainRef__runtime;
    const rt = instance.__chainRef__runtime;
    newRT.__function = rt.__function;
    newInstance.extendRuntime(
      deepClone ? __deepClone(instance.runtime) : instance.runtime
    );
    newInstance.extendFunctionsFromObject(rt.__functions);
    newRT.__argsCache = [...rt.__argsCache];
    return newInstance;
  };
  instance.setFunction = (f: any) => {
    const fun = (() => {
      if (typeof f === "string") {
        return instance.__chainRef__runtime.__functions[f];
      } else if (typeof f === "function") {
        return f;
      } else if (f === null || f === undefined) return null;
      else throw new Error(`unknown type of set Function ${f}`);
    })();

    if (fun) {
      if (fun.__modelType === FUNCTION_MODEL_TYPE_INSTANCE)
        throw new Error("use  setInstanceFunction to set Instance Function");
      instance.__chainRef__runtime.__function = fun;
      (instance.__chainRef__runtime.__function as ExtendFunction).__modelType =
        FUNCTION_MODEL_TYPE_NONE;
    }
    return instance;
  };
  instance.setInstanceFunction = (f: any) => {
    const fun = (() => {
      if (typeof f === "string") {
        return instance.__chainRef__runtime.__functions[f];
      } else if (typeof f === "function") {
        return f;
      } else if (f === null || f === undefined) return null;
      else throw new Error(`unknown type of set Function ${f}`);
    })();

    if (fun) {
      if (fun.__modelType === FUNCTION_MODEL_TYPE_NONE)
        throw new Error("use  setFunction to set non-Instance Function");
      instance.__chainRef__runtime.__function = fun;
      (instance.__chainRef__runtime.__function as ExtendFunction).__modelType =
        FUNCTION_MODEL_TYPE_INSTANCE;
    }
    return instance as any;
  };
  instance.batch = (...argsArray: any[]) => {
    if (!instance.__chainRef__runtime.__function) return instance;
    argsArray.forEach((args) => {
      instance(...args);
    });
    return instance;
  };
  instance.zipBatch = (...argsArray: any[][]) => {
    if (!instance.__chainRef__runtime.__function) return instance;
    const itemsNum = Math.max(...argsArray.map((x) => x.length));
    Array.from({ length: itemsNum }, (_, index) => index).forEach((index) => {
      const args = argsArray.map((x) => x[index]);
      while (args.length && args[args.length - 1] === undefined) {
        args.pop();
      }
      instance(...(args as any));
    });
    return instance;
  };
  instance.extendFunctionsFromObject = (funcs: Record<string, any>) => {
    const [funcsKey, funcsTarget] = (() => {
      if (isClass(funcs)) {
        return [Object.getOwnPropertyNames(funcs.prototype), funcs.prototype];
      } else if (isClassInstance(funcs)) {
        return [Object.getOwnPropertyNames(Object.getPrototypeOf(funcs))];
      } else {
        return [Object.keys(funcs)];
      }
    })() as [string[], any];
    funcsKey.forEach((x) => {
      const f = (funcsTarget || funcs)[x];
      if (typeof f === "function") {
        f.__modelType = FUNCTION_MODEL_TYPE_NONE;
        instance.__chainRef__runtime.__functions[x] = f;
        (instance as any)[x] = wrapCallFunc(
          instance.__chainRef__runtime.__functions[x]
        );
      }
    });
    return instance as any;
  };
  instance.extendInstanceFunctions = (funcs: Record<string, any>) => {
    Object.keys(funcs).forEach((x) => {
      if (typeof funcs[x] === "function") {
        instance.__chainRef__runtime.__functions[x] = funcs[x];
        (instance.__chainRef__runtime.__functions[x] as any).__modelType =
          FUNCTION_MODEL_TYPE_INSTANCE;
        (instance as any)[x] = wrapCallFunc(funcs[x]);
      }
    });
    return instance as any;
  };
  (instance as any).extendRuntime = (obj?: any) => {
    Object.assign(instance.runtime, obj);
    return instance;
  };
  instance.clearArgCache = () => {
    instance.__chainRef__runtime.__argsCache.length = 0;
    return instance;
  };
  instance.setThis = (value: any) => {
    instance.__chainRef__runtime.__thisArg = value;
    return instance;
  };
  instance.getThis = () => {
    return instance.__chainRef__runtime.__thisArg;
  };

  const getSetFunctions = {
    get runtime() {
      return instance.__chainRef__runtime.__extended;
    },
  };
  Object.assign(instance, getSetFunctions);
  return instance;
};

function isClassInstance(obj: any) {
  return (
    obj.constructor && obj.constructor.toString().substring(0, 5) === "class"
  );
}
function isClass(v: any) {
  return typeof v === "function" && /^\s*class\s+/.test(v.toString());
}
function __deepClone<T>(obj: T): T {
  if (typeof obj !== "object" || obj === null) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => __deepClone(item)) as any;
  }

  const clonedObj = {} as T;
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      clonedObj[key] = __deepClone(obj[key]);
    }
  }

  return clonedObj;
}
