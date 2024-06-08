export class Tuple {
    static toKey<T1 extends number, T2 extends number>(t1: T1, t2: T2): string {
        return `${t1},${t2}`;
    }
}
