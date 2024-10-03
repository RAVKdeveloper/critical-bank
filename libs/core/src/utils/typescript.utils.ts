export type DeepReadonly<T> = { readonly [P in keyof T]: DeepReadonly<T[P]> };
export type DeepMutable<T> = { -readonly [P in keyof T]: DeepMutable<T[P]> };

export type Exact<T, U extends T> = {
    [Key in keyof U]: Key extends keyof T
        ? U[Key] extends object
            ? Exact<T[Key], U[Key]>
            : U[Key]
        : never;
};
