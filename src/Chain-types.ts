type RemoveHead<N extends number, Tuple extends any[]> = N extends 0
  ? Tuple
  : Tuple extends [any, ...infer Rest]
  ? RemoveHead<Prev<N>, Rest>
  : unknown[];

type Constructor<T> = new (...args:any[])=>T;


type IsEndsWith<
  S extends string,
  EndsWith extends string
> = S extends `${infer _}${EndsWith}` ? true : false;
type AND<A, B> = A extends false ? false : B extends true ? true : false;
type OR<A, B> = A extends true ? true : B extends true ? true : false;
type NOT<A> = A extends true ? false : true;
type Prev<N extends number> = N extends 1
  ? 0
  : N extends 0
  ? 0
  : N extends 2
  ? 1
  : N extends 3
  ? 2
  : N extends 4
  ? 3
  : N extends 5
  ? 4
  : N extends 6
  ? 5
  : N extends 7
  ? 6
  : N extends 8
  ? 7
  : N extends 9
  ? 8
  : number;

type ANY_FUNCTION = (...args: any) => any;
type MapToBoolean<T extends string, U> = {
  [K in T]: K extends U ? true : false;
};

type FindTrue<T> = {
  [K in keyof T]: T[K] extends true ? K : never;
}[keyof T] extends never
  ? false
  : true;

type Has<T, U> = T extends string ? FindTrue<MapToBoolean<T, U>> : false;

type FindTypeError = "____FindTypeError__";

type _ExtractField<
  T,
  PropertyName extends string
> = PropertyName extends `${infer K}[${infer op}]`
  ? K extends keyof T
    ? op extends ""
      ? T[K][]
      : op extends "number"
      ? T[K] extends any[]
        ? T[K][number]
        : FindTypeError | `[number] must be used on array type ${PropertyName}`
      : FindTypeError | `unknown op case:${op}`
    : FindTypeError | `can't find property [flag0]: ${PropertyName}`
  : PropertyName extends keyof T
  ? T[PropertyName]
  : FindTypeError | `can't find property [flag1]: ${PropertyName}`;

type FindType<T, Path> = Path extends never
  ? FindTypeError | "Path is never"
  : Has<Path, FindTypeError> extends true
  ? Path
  : Path extends string
  ? Path extends `${infer K}::${infer Rest}`
    ? FindType<_ExtractField<T, K>, Rest>
    : _ExtractField<T, Path>
  : FindTypeError | "Path must be literal string type!";

export const FUNCTION_MODEL_TYPE_NONE = "NONE";
export const FUNCTION_MODEL_TYPE_INSTANCE = "INSTANCE";
export type FunctionModelType =
  | typeof FUNCTION_MODEL_TYPE_NONE
  | typeof FUNCTION_MODEL_TYPE_INSTANCE;
export type ExtendFunction = ANY_FUNCTION & {
  __modelType: FunctionModelType;
};

type ExtendFunctionNone = ExtendFunction & {
  __static__modelType_none: true;
};
type ExtendFunctionInstance = ExtendFunction & {
  __static__modelType_instance: true;
};

export type Make_None_Function<T extends ANY_FUNCTION> = ExtendFunctionNone & T;
export type Make_Instance_Function<T extends ANY_FUNCTION> =
  ExtendFunctionInstance & T;

type IsAny<T> = 0 extends 1 & T ? true : false;
type FuncFilter<T> = {
  [K in keyof T]: IsAny<T[K]> extends true
    ? never
    : T[K] extends ANY_FUNCTION
    ? K
    : never;
}[keyof T];

type ReplaceProperty<A, B> = Omit<A, keyof B> & B;

type TupleToArray<T extends any[]> = {
  [K in keyof T]: T[K][];
};
//因为bug，不得不采取这种方式
type Zip<T extends [...any]> = (...args: TupleToArray<T>) => any;

type FUNCTIONS_TYPE<T extends Record<string, any>> = {
  [K in FuncFilter<T>]: T[K];
};

type ChainRuntimeInfer = "_ChainRuntimeInfer_";
type ChainRuntimeMap = "_ChainRuntimeMap_";
type ChainRuntimeChange = `_ChainRuntimeChange_`;

export type ChangeChainRuntime<from extends string, to extends string> = [
  ChainRuntimeChange,
  from,
  to
];

export type ReferTo<
  AccessPathOrGenericRefer extends string,
  Operater extends "[]" | "[number]" | undefined = undefined
> = [ChainRuntimeInfer, AccessPathOrGenericRefer, Operater];

export type ReMapTo<
  ReferFields extends string | undefined,
  ReferFieldsArray extends string | undefined = undefined
> = [ChainRuntimeMap, ReferFields, ReferFieldsArray];

type ValueByIndex<
  T,
  A0,
  A1,
  A2,
  A3,
  ReturnNever extends boolean
> = T extends "<0>"
  ? A0
  : T extends "<1>"
  ? A1
  : T extends "<2>"
  ? A2
  : T extends "<3>"
  ? A3
  : ReturnNever extends true
  ? never
  : T;

type RemoveFunctionHeadParams<
  Params extends [...any],
  FUNCTION extends ANY_FUNCTION
> = IsAny<Params[0]> extends true
  ? Params
  : AND<
      Params[0] extends ChainRef<ANY_FUNCTION, {}, {}> ? true : false,
      FUNCTION extends ExtendFunctionInstance ? true : false
    > extends true
  ? RemoveHead<1, Params>
  : Params;

type RuntimeInfer<
  Param,
  RUNTIME extends Record<any, any>,
  A0,
  A1,
  A2,
  A3
> = ValueByIndex<Param, A0, A1, A2, A3, true> extends never
  ? FindType<RUNTIME, Param>
  : ValueByIndex<Param, A0, A1, A2, A3, false>;

type RuntimeConvert<
  Param extends [...any],
  RUNTIME extends Record<any, any>,
  ReturnNever extends boolean,
  A0,
  A1,
  A2,
  A3
> = Param[0] extends ChainRuntimeMap
  ? {
      [K2 in Param[1]]: RUNTIME[K2];
    } & {
      [K2 in Param[2]]: RUNTIME[K2][number];
    }
  : Param[0] extends ChainRuntimeInfer
  ? Param[2] extends "[]"
    ? RuntimeInfer<Param[1], RUNTIME, A0, A1, A2, A3>[]
    : Param[2] extends "[number]"
    ? RuntimeInfer<Param[1], RUNTIME, A0, A1, A2, A3> extends any[]?RuntimeInfer<Param[1], RUNTIME, A0, A1, A2, A3>[number]:never
    : RuntimeInfer<Param[1], RUNTIME, A0, A1, A2, A3>
  : ReturnNever extends true
  ? never
  : Param;
type MapChainType<
  Param,
  CUR_FUNCTION extends ANY_FUNCTION,
  FUNCTION extends ANY_FUNCTION,
  FUNCTIONS extends Record<string, ANY_FUNCTION>,
  RUNTIME extends Record<any, any>,
  ReturnNever extends boolean,
  ConvertCallback extends boolean,
  A0,
  A1,
  A2,
  A3
> = IsAny<Param> extends true
  ? any
  : Param extends CurrentStateChainRef
  ? CUR_FUNCTION extends ExtendFunctionInstance
    ? ChainRef<FUNCTION, FUNCTIONS, RUNTIME>
    : ReturnNever extends true
    ? never
    : Param
  : Param extends ANY_FUNCTION
  ? ConvertCallback extends false
    ? Param
    : Parameters<Param>[0] extends ChainRef<ANY_FUNCTION, {}, {}>
    ? (
        ch: ChainRef<FUNCTION, FUNCTIONS, RUNTIME>,
        ...args: ChainParams<
          RemoveHead<1, Parameters<Param>>,
          never,
          FUNCTION,
          FUNCTIONS,
          RUNTIME,
          false,
          A0,
          A1,
          A2,
          A3
        >
      ) => ReturnType<Param>
    : (
        ...args: ChainParams<
          RemoveHead<0, Parameters<Param>>,
          never,
          FUNCTION,
          FUNCTIONS,
          RUNTIME,
          false,
          A0,
          A1,
          A2,
          A3
        >
      ) => ReturnType<Param>
  : Param extends [...any]
  ? RuntimeConvert<Param, RUNTIME, ReturnNever, A0, A1, A2, A3>
  : ReturnNever extends true
  ? never
  : Param;

type ChainParamConvert<
  N extends 0 | 1 | 2 | 3,
  Params extends [...any],
  CUR_FUNCTION extends ANY_FUNCTION,
  FUNCTION extends ANY_FUNCTION,
  FUNCTIONS extends Record<string, ANY_FUNCTION>,
  RUNTIME extends Record<any, any>,
  ConvertCallback extends boolean,
  A0,
  A1,
  A2,
  A3
> = Params[N] extends undefined
  ? never
  : MapChainType<
      Params[N],
      CUR_FUNCTION,
      FUNCTION,
      FUNCTIONS,
      RUNTIME,
      true,
      ConvertCallback,
      A0,
      A1,
      A2,
      A3
    >;
type ChainParams<
  Params extends [...any],
  CUR_FUNCTION extends ANY_FUNCTION,
  FUNCTION extends ANY_FUNCTION,
  FUNCTIONS extends Record<string, ANY_FUNCTION>,
  RUNTIME extends Record<any, any>,
  ConvertCallback extends boolean,
  A0,
  A1,
  A2,
  A3
> = ChainParamConvert<
  0,
  Params,
  CUR_FUNCTION,
  FUNCTION,
  FUNCTIONS,
  RUNTIME,
  ConvertCallback,
  A0,
  A1,
  A2,
  A3
> extends never
  ? RemoveHead<0, Params>
  : [
      a0: ChainParamConvert<
        0,
        Params,
        CUR_FUNCTION,
        FUNCTION,
        FUNCTIONS,
        RUNTIME,
        ConvertCallback,
        A0,
        A1,
        A2,
        A3
      >,
      ...args: ChainParamConvert<
        1,
        Params,
        CUR_FUNCTION,
        FUNCTION,
        FUNCTIONS,
        RUNTIME,
        ConvertCallback,
        A0,
        A1,
        A2,
        A3
      > extends never
        ? RemoveHead<1, Params>
        : [
            a1: ChainParamConvert<
              1,
              Params,
              CUR_FUNCTION,
              FUNCTION,
              FUNCTIONS,
              RUNTIME,
              ConvertCallback,
              A0,
              A1,
              A2,
              A3
            >,
            ...args: ChainParamConvert<
              2,
              Params,
              CUR_FUNCTION,
              FUNCTION,
              FUNCTIONS,
              RUNTIME,
              ConvertCallback,
              A0,
              A1,
              A2,
              A3
            > extends never
              ? RemoveHead<2, Params>
              : [
                  a2: ChainParamConvert<
                    2,
                    Params,
                    CUR_FUNCTION,
                    FUNCTION,
                    FUNCTIONS,
                    RUNTIME,
                    ConvertCallback,
                    A0,
                    A1,
                    A2,
                    A3
                  >,
                  ...args: ChainParamConvert<
                    3,
                    Params,
                    CUR_FUNCTION,
                    FUNCTION,
                    FUNCTIONS,
                    RUNTIME,
                    ConvertCallback,
                    A0,
                    A1,
                    A2,
                    A3
                  > extends never
                    ? RemoveHead<3, Params>
                    : [
                        a3: ChainParamConvert<
                          3,
                          Params,
                          CUR_FUNCTION,
                          FUNCTION,
                          FUNCTIONS,
                          RUNTIME,
                          ConvertCallback,
                          A0,
                          A1,
                          A2,
                          A3
                        >,
                        ...args: RemoveHead<4, Params>
                      ]
                ]
          ]
    ];

type GetChainRuntimeChange<FUNCTION extends ANY_FUNCTION> =
  ReturnType<FUNCTION>[0] extends ChainRuntimeChange
    ? ReturnType<FUNCTION>
    : never;

type ChainReturn<
  NO_REDIRETION extends boolean,
  CUR_FUNCTION extends ANY_FUNCTION,
  FUNCTION extends ANY_FUNCTION,
  FUNCTIONS extends Record<string, ANY_FUNCTION>,
  RUNTIME extends Record<any, any>,
  A0,
  A1,
  A2,
  A3
> = ReturnType<CUR_FUNCTION> extends ANY_FUNCTION
  ? ChainRef<
      NO_REDIRETION extends true ? FUNCTION : ReturnType<CUR_FUNCTION>,
      FUNCTIONS,
      RUNTIME
    >
  : ReturnType<CUR_FUNCTION> extends void
  ? ChainRef<FUNCTION, FUNCTIONS, RUNTIME>
  : NOT<
      RuntimeConvert<
        ReturnType<CUR_FUNCTION>,
        RUNTIME,
        true,
        A0,
        A1,
        A2,
        A3
      > extends never
        ? true
        : false
    > extends true
  ? RuntimeConvert<ReturnType<CUR_FUNCTION>, RUNTIME, false, A0, A1, A2, A3>
  : NOT<
      GetChainRuntimeChange<CUR_FUNCTION> extends never ? true : false
    > extends true
  ? ChainRef<
      FUNCTION,
      FUNCTIONS,
      ReplaceProperty<
        RUNTIME,
        {
          [K2 in ValueByIndex<
            GetChainRuntimeChange<CUR_FUNCTION>[1],
            A0,
            A1,
            A2,
            A3,
            false
          > extends string
            ? ValueByIndex<
                GetChainRuntimeChange<CUR_FUNCTION>[1],
                A0,
                A1,
                A2,
                A3,
                false
              >
            : never]: ValueByIndex<
            GetChainRuntimeChange<CUR_FUNCTION>[2],
            A0,
            A1,
            A2,
            A3,
            false
          >;
        }
      >
    >
  : NO_REDIRETION extends true
  ? ChainRef<FUNCTION, FUNCTIONS, RUNTIME>
  : MapChainType<
      ReturnType<CUR_FUNCTION>,
      never,
      FUNCTION,
      FUNCTIONS,
      RUNTIME,
      false,
      false,
      A0,
      A1,
      A2,
      A3
    >;
export type ChainRefInit = ChainRef<ANY_FUNCTION, {}, {}>;
export type CurrentStateChainRef = ChainRef<ANY_FUNCTION, {}, {}>;
export type ChainRef<
  FUNCTION extends ANY_FUNCTION,
  FUNCTIONS extends Record<string, ANY_FUNCTION>,
  RUNTIME extends Record<any, any>
> = {
  <A0 = any, A1 = any, A2 = any, A3 = any>(
    ...args: ChainParams<
      RemoveFunctionHeadParams<Parameters<FUNCTION>, FUNCTION>,
      FUNCTION,
      FUNCTION,
      FUNCTIONS,
      RUNTIME,
      true,
      A0,
      A1,
      A2,
      A3
    >
  ): ChainReturn<true, FUNCTION, FUNCTION, FUNCTIONS, RUNTIME, A0, A1, A2, A3>;
} & {
  [K in keyof FUNCTIONS]: <A0 = any, A1 = any, A2 = any, A3 = any>(
    ...args: ChainParams<
      RemoveFunctionHeadParams<Parameters<FUNCTIONS[K]>, FUNCTIONS[K]>,
      FUNCTIONS[K],
      FUNCTION,
      FUNCTIONS,
      RUNTIME,
      true,
      A0,
      A1,
      A2,
      A3
    >
  ) => ChainReturn<
    false,
    FUNCTIONS[K],
    FUNCTION,
    FUNCTIONS,
    RUNTIME,
    A0,
    A1,
    A2,
    A3
  >;
} & {
  clone(deepClone?: boolean): ChainRef<FUNCTION, FUNCTIONS, RUNTIME>;
  clearArgCache(): ChainRef<FUNCTION, FUNCTIONS, RUNTIME>;
  batch(
    ...argsArray: Parameters<ChainRef<FUNCTION, FUNCTIONS, RUNTIME>>[]
  ): ChainRef<FUNCTION, FUNCTIONS, RUNTIME>;
  zipBatch(
    ...argsArray: Parameters<
      Zip<Parameters<ChainRef<FUNCTION, FUNCTIONS, RUNTIME>>>
    >
  ): ChainRef<FUNCTION, FUNCTIONS, RUNTIME>;
  setFunction<T extends ANY_FUNCTION>(
    f: T
  ): ChainRef<Make_None_Function<T>, FUNCTIONS, RUNTIME>;
  setFunction<T extends keyof FUNCTIONS>(
    f: T
  ): ChainRef<
    T extends ANY_FUNCTION ? Make_None_Function<T> : FUNCTIONS[T],
    FUNCTIONS,
    RUNTIME
  >;

  setInstanceFunction<T extends keyof FUNCTIONS>(
    f: T
  ): ChainRef<
    T extends (ch: ChainRef<FUNCTION, FUNCTIONS, RUNTIME>, ...args: any) => any
      ? Make_Instance_Function<T>
      : FUNCTIONS[T],
    FUNCTIONS,
    RUNTIME
  >;
  setInstanceFunction<
    T extends (ch: ChainRef<FUNCTION, FUNCTIONS, RUNTIME>, ...args: any) => any
  >(
    f: T
  ): ChainRef<Make_Instance_Function<T>, FUNCTIONS, RUNTIME>;
  extendFunctionsFromObject<T>(
    funcs: Constructor<T>
  ): ChainRef<
    FUNCTION,
    FUNCTIONS &  ({
      [K in keyof T]: T[K] extends ANY_FUNCTION
        ? Make_None_Function<T[K]>
        : never;
    }),
    RUNTIME
  >;
  extendFunctionsFromObject<T extends Record<string, any>>(
    funcs: T
  ): ChainRef<
    FUNCTION,
    FUNCTIONS &  ({
      [K in keyof T]: T[K] extends ANY_FUNCTION
        ? Make_None_Function<T[K]>
        : never;
    }),
    RUNTIME
  >;
  extendInstanceFunctions<
    T extends Record<
      string,
      (ch: ChainRef<FUNCTION, FUNCTIONS, RUNTIME>, ...args: any) => any
    >
  >(
    funcs: T
  ): ChainRef<
    FUNCTION,
    FUNCTIONS & (  {
      [K in keyof T]: T[K] extends ANY_FUNCTION
        ? Make_Instance_Function<T[K]>
        : never;
    }),
    RUNTIME
  >;
} & {
  __chainRef__runtime: {
    __thisArg: any;
    __function: ExtendFunction | string;
    __functions: Record<string, ExtendFunction>;
    __argsCache: any[];
    __extended: RUNTIME;
  };
  get runtime(): RUNTIME;
  getThis(): any;
  setThis(value: any): ChainRef<FUNCTION, FUNCTIONS, RUNTIME>;
  extendRuntime<T extends Record<string, any>>(
    obj?: T
  ): ChainRef<FUNCTION, FUNCTIONS, ReplaceProperty<RUNTIME, T>>;
};
