// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type SafeAny = any;

export type FunctionProp<T> = (...args: SafeAny[]) => T;
