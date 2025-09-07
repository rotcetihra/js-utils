import { EqualsTypedArrayCase } from '@/index.mjs';

describe('EqualsTypedArrayCase', () => {
    const [guard, compare] = EqualsTypedArrayCase;

    // ----------------------- GUARD -----------------------

    test('guard: true для пар TypedArray; false для DataView/не-view/смешанных', () => {
        expect(guard(new Int8Array(2), new Int8Array(2), {})).toBe(true);
        expect(guard(new Uint8Array(1), new Uint8ClampedArray(1), {})).toBe(
            true,
        ); // guard лишь проверяет, что это view (тип проверим в compare)

        expect(
            guard(
                new DataView(new ArrayBuffer(2)),
                new Int8Array(2) as unknown,
                {},
            ),
        ).toBe(false);
        expect(
            guard(
                new Int8Array(2),
                new DataView(new ArrayBuffer(2)) as unknown,
                {},
            ),
        ).toBe(false);

        expect(guard({}, new Int8Array(1), {})).toBe(false);
        expect(guard(123 as unknown, new Float32Array(1), {})).toBe(false);
    });

    // ----------------------- COMPARE: одинаковый тип и содержимое -----------------------

    test('Int16Array: одинаковые элементы → true', () => {
        const a = new Int16Array([1, -2, 300]);
        const b = new Int16Array([1, -2, 300]);
        expect(compare(a, b, {})).toBe(true);
    });

    test('Uint8Array: разная длина → false', () => {
        const a = new Uint8Array([1, 2]);
        const b = new Uint8Array([1, 2, 3]);
        expect(compare(a, b, {})).toBe(false);
    });

    test('Int32Array: различие в одном элементе → false', () => {
        const a = new Int32Array([1, 2, 3]);
        const b = new Int32Array([1, 2, 4]);
        expect(compare(a, b, {})).toBe(false);
    });

    // ----------------------- COMPARE: NaN и ±0 для Float-массивов -----------------------

    test('Float64Array: NaN ~ NaN эквивалентны; +0 и -0 различаются в strict', () => {
        const a = new Float64Array([1, Number.NaN, +0]);
        const b = new Float64Array([1, Number.NaN, -0]);

        // guard пройдёт (оба view не DataView)
        expect(guard(a, b, {})).toBe(true);
        // strict (Object.is): NaN ~ NaN true, но +0 !== -0 → false
        expect(compare(a, b, {})).toBe(false);
        // loose: == считает +0 == -0 → true
        expect(compare(a, b, { loose: true })).toBe(true);
    });

    // ----------------------- COMPARE: BigInt-варианты -----------------------

    test('BigInt64Array: одинаковые элементы → true', () => {
        const a = new BigInt64Array([1n, -2n, 10n]);
        const b = new BigInt64Array([1n, -2n, 10n]);
        expect(compare(a, b, {})).toBe(true);
    });

    test('BigInt64Array: различие в одном элементе → false', () => {
        const a = new BigInt64Array([1n, 2n]);
        const b = new BigInt64Array([1n, 3n]);
        expect(compare(a, b, {})).toBe(false);
    });

    test('BigUint64Array: длина совпадает, элементы равны в strict и loose', () => {
        const a = new BigUint64Array([0n, 42n]);
        const b = new BigUint64Array([0n, 42n]);
        expect(compare(a, b, {})).toBe(true);
        expect(compare(a, b, { loose: true })).toBe(true);
    });

    // ----------------------- COMPARE: различие типов (конструктор) -----------------------

    test('разные типы TypedArray (конструктор) → false', () => {
        const a = new Uint8Array([1, 2, 3]);
        const b = new Uint8ClampedArray([1, 2, 3]); // содержимое похоже, но тип отличается
        expect(compare(a, b, {})).toBe(false);

        const c = new Float32Array([1, 2]);
        const d = new Float64Array([1, 2]);
        expect(compare(c, d, {})).toBe(false);
    });

    // ----------------------- IMMUTABILITY -----------------------

    test('кортеж заморожен', () => {
        expect(Object.isFrozen(EqualsTypedArrayCase)).toBe(true);
    });
});
