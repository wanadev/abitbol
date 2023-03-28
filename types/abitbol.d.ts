export = Class

declare interface AbitbolClass<T> {
    new(params?: any): AbitbolObject<T>,
    $map: {
        attributes: {}
        methods: {}
        computedProperties: {}
    }
    $extend<U>(properties: U): AbitbolClass<U & T>
}

type PropName<T extends string> = Uncapitalize<T>

type GetterPropNameFromGet<T extends string> = T extends `get${infer Prefix}` ? PropName<Prefix> : never;
type GetterPropNameFromSet<T extends string> = T extends `is${infer Prefix}` ? PropName<Prefix> : never;
type GetterPropName<T extends string> = GetterPropNameFromGet<T> | GetterPropNameFromSet<T>
type GetterValue<T> = T extends (...args: any[]) => infer R ? R : never;

type ObjectDescriptor<Type> = {
    [Property in keyof Type]: Type[Property]
}

type StringKey<Type> = keyof Type extends string ? keyof Type : never;

type ComputedProps<Type> = {
    [Property in StringKey<Type> as GetterPropName<Property>]: GetterValue<Type[Property]>
}

type AbitbolComputedProps<Type> = ObjectDescriptor<Type> & ComputedProps<Type>

declare type AbitbolObject<Type> = AbitbolComputedProps<Type> & {
    $class: AbitbolClass<Type>,
    $map: {
        attributes: {},
        methods: {},
        computedProperties: {},
    },
    $data: {},
}

declare namespace Class {
    function $class(): void
    namespace $class {
        namespace $map {
            const attributes: {}
            const methods: {}
            const computedProperties: {}
        }
    }

    function $extend<T>(properties: T): AbitbolClass<T>
}