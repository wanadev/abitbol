export = Class

type PropName<T extends string> = Uncapitalize<T>

type GetterPropNameFromGet<T extends string> = T extends `get${infer Prefix}` ? PropName<Prefix> : never;
type GetterPropNameFromSet<T extends string> = T extends `is${infer Prefix}` ? PropName<Prefix> : never;
type GetterPropName<T extends string> = GetterPropNameFromGet<T> | GetterPropNameFromSet<T>
type GetterValue<T> = T extends (...args: any[]) => infer R ? R : any;

type ObjectDescriptor<Type> = {
    [Property in keyof Type]: Type[Property];
}

type StringKey<Type> = keyof Type extends string ? keyof Type : never;

type ComputedProps<Type> = {
    [Property in StringKey<Type> as GetterPropName<Property>]: GetterValue<Type[Property]>
}

type AbitbolComputedProps<Type> = ObjectDescriptor<Type> & ComputedProps<Type>
type ClassDescriptor = {
    [x: string]: any,
    __include__: any[],
    __classvars__: any,
    __init__(...args: any[]): void,
    __preBuild__(properties, NewClass, SuperClass): void,
    __postBuild__(properties, NewClass, SuperClass): void,
}

declare interface AbitbolClass<T> {
    new(params?: any): AbitbolObject<T>,
    $map: {
        attributes: {}
        methods: {}
        computedProperties: {}
    }
    $extend<ClassDescriptor>(properties: ClassDescriptor): AbitbolClass<ClassDescriptor & T>
}

declare type AbitbolObject<Type> = AbitbolComputedProps<Type> & {
    $class: AbitbolClass<Type>,
    $map: {
        attributes: {},
        methods: {},
        computedProperties: {},
    },
    $data: any,
    $super(...args): any,
    $name: string,
    $computedPropertyName: string,
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