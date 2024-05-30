// #region Constructor Arguments

type InitArgType<E, I> = E extends { __init__: (...args: infer A) => any }
    ? A
    : I extends { __init__: (...args: infer A) => any }
        ? A
        : any[]

// #endregion

// #region Computed Properties

type GetterIdentifier<K> = K extends `get${infer R}` | `is${infer R}` | `has${infer R}` ? Uncapitalize<R> : never;
type SetterIdentifier<K> = K extends `set${infer R}` ? Uncapitalize<R> : never;
type GetterOrSetterIdentifier<K> = K extends `get${infer R}` | `is${infer R}` | `has${infer R}` | `set${infer R}` ? Uncapitalize<R> : never;
type ReadonlyGetterIdentifier<I, SI> = Pick<SI, Exclude<keyof SI, keyof I>> extends string ? never : I;

type GetterValue<V> = V extends () => infer R ? R : never;
type SetterValue<V> = V extends (value: infer R) => void ? R : never;

type ExtractGetters<T> = {
    [K in keyof T as GetterIdentifier<K>]: GetterValue<T[K]>;
};

type ExtractSetters<T> = {
    [K in keyof T as SetterIdentifier<K>]: SetterValue<T[K]>;
};

type ExtractSetterIdentifier<T> = {
    [K in keyof T as SetterIdentifier<K>]: K;
};

type ExtractReadonlyGetters<T> = {
    readonly [K in keyof T as ReadonlyGetterIdentifier<GetterIdentifier<K>, ExtractSetterIdentifier<T>>]: GetterValue<T[K]>;
};

type WritableOrReadonly<A, R> = R & Pick<A, Exclude<keyof A, keyof R>>;
type Getter<P> = WritableOrReadonly<ExtractGetters<P>, ExtractReadonlyGetters<P>>;
type Setter<P> = ExtractSetters<P>;
type GetterAndSetter<P> = Getter<P> & Setter<P>;

type GetGetterMethodName<K extends string, P> = `get${Capitalize<K>}` extends keyof P
    ? `get${Capitalize<K>}` : `is${Capitalize<K>}`extends keyof P
    ? `is${Capitalize<K>}` : `has${Capitalize<K>}`extends keyof P
    ? `has${Capitalize<K>}` : undefined;

type GetSetterMethodName<K extends string, P> = `set${Capitalize<K>}`extends keyof P
    ? `set${Capitalize<K>}` : undefined;

type IsGetterOrSetterIdentifier<K> = K extends `get${string}` | `is${string}` | `has${string}` | `set${string}` ? K : never;

// #endregion

// #region Mixin

type UnionToIntersection<U> =
    (U extends any ? (k: U) => void : never) extends
    ((k: infer I) => void) ? I : never;

type UnionOfArrayElements<T> = T extends (infer U)[] ? U : never;

type ExtractUnion<T> = T extends { __include__: infer U } ? UnionOfArrayElements<U> : never;

type ExtractMixins<E, I extends { prototype: any }> = UnionToIntersection<ExtractUnion<E & I["prototype"]>>

type ExtractMixinsStaticProperties<T> = T extends { __include__: infer U }
    ? UnionToIntersection<ExtractStaticProperties<UnionOfArrayElements<U>>>
    : NonNullable<unknown>

// #endregion

// #region Static Properties

type ExtractStaticProperties<T> = (T extends { __classvars__: infer U } ? U : NonNullable<unknown>)
    & ExtractMixinsStaticProperties<T>;

// #endregion

// #region Special Properties

type ExtractAttributesPropertiesKeys<P> = {
    [K in keyof P]: P[K] extends (...args: any[]) => any ? never : K;
}[keyof P]

type ExtractMethodsPropertiesKeys<P> = {
    [K in keyof P]: P[K] extends (...args: any[]) => any ? K : never;
}[keyof P]

type AttributesPropertiesKeys<P> = ExtractAttributesPropertiesKeys<P>;

type MethodsPropertiesKeys<P> = ExtractMethodsPropertiesKeys<P>;

type SuperVariables<P> = {
    $class: any,
    $data: Record<string, any>,
    $map: {
        attributes: {
            [K in AttributesPropertiesKeys<P>]: true;
        },
        computedProperties: {
            [K in keyof GetterAndSetter<P> & string] : {
                get: GetGetterMethodName<K, P>,
                set: GetSetterMethodName<K, P>,
                annotations: Record<string, any>,
            }
        },
        methods: {
            [K in MethodsPropertiesKeys<P>]: {
                annotations: Record<string, any>,
            }
        },
    }
};

type WithSpecialProperties<E, I extends { prototype: any }, K extends keyof E, PI> = PI
    & (I["prototype"][K] extends CallableFunction ? { $super: I["prototype"][K] } : NonNullable<unknown>)
    & (K extends IsGetterOrSetterIdentifier<K> ? { $computedPropertyName: GetterOrSetterIdentifier<K> } : NonNullable<unknown>)
    & { $name: K }

type InjectSpecialProperties<E, I extends { prototype: any }, PI> = {
    [K in keyof E]: E[K] extends (...args: infer A) => infer R
        ? (this: WithSpecialProperties<E, I, K, PI>, ...args: A) => R
        : E[K]
}

// #endregion

type ExtractProperties<E, I extends { prototype: any }, SP> = Omit<
    Omit<I["prototype"], keyof E | keyof SP> & E & ExtractMixins<E, I>,
    "__include__" | "__classvars__"
>

type PublicInstance<P, S> = GetterAndSetter<P> & S & P

type PrivateInstance<E, I extends { prototype: any }, PI> = InjectSpecialProperties<E, I, PI>;

export type ExtendedAbitbolClass<E, I, SP, P, S, PI> = Omit<I, keyof E>
    & { prototype: P }
    & S
    & SP
    & (new (...args: InitArgType<E, I>) => PI)

export class AbitbolClass {
    static $extend<
        E extends object, // Extended properties
        I extends { prototype: any }, // Super class
        SP = ExtractStaticProperties<E & I["prototype"]>, // Static properties
        P = ExtractProperties<E, I, SP>, // properties
        S = SuperVariables<P>, // Super variables
        PI = PublicInstance<P, S> // Public instance
    >(
        this: I,
        properties?: PrivateInstance<E, I, PI>
    ): ExtendedAbitbolClass<E, I, SP, P, S, PI>

    static $class: any;

    static $map: {
        attributes: { },
        computedProperties: { },
        methods: { },
    }
}

export default AbitbolClass;
