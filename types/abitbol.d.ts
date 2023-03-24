export = Class;

declare interface AbitbolClass<T> {
    new(params?: T): AbitbolObject<T>,
    $map: {
        attributes: {};
        methods: {};
        computedProperties: {};
    }
    $extend<U>(properties: U): AbitbolClass<U & T>;
}

type ComputedType<Type> = {
    [Property in keyof Type]: Type[Property]
}

type AbitbolObject<Type> = ComputedType<Type> & {
    $class: AbitbolClass<Type>,
    $map: {
        attributes: {},
        methods: {},
        computedProperties: {},
    },
    $data: {},
}

declare namespace Class {
    function $class(): void;
    namespace $class {
        namespace $map {
            const attributes: {};
            const methods: {};
            const computedProperties: {};
        }
    }

    function $extend<T>(properties: T): AbitbolClass<T>;
}