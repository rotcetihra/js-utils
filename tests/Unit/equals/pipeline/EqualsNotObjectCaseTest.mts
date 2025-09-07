import { EqualsNotObjectCase } from '@/index.mjs';

describe('EqualsNotObjectCase', () => {
    const [guard, compare] = EqualsNotObjectCase;

    // ----------------------- GUARD: TRUTHY -----------------------

    test('guard: true, когда хотя бы один операнд не объект (number | string | boolean | symbol | bigint | undefined | function)', () => {
        expect(guard(1, { x: 1 }, {})).toBe(true);
        expect(compare(1, { x: 1 }, {})).toBe(false);

        expect(guard('a', {}, {})).toBe(true);
        expect(compare('a', {}, {})).toBe(false);

        expect(guard(true, [], {})).toBe(true);
        expect(compare(true, [], {})).toBe(false);

        // symbol / bigint
        // символ — примитив
        expect(guard(Symbol('s'), {}, {})).toBe(true);
        expect(guard(10n, {}, {})).toBe(true);

        // undefined
        expect(guard(undefined, {}, {})).toBe(true);

        // function — typeof "function"
        const fn = () => {};
        expect(guard(fn, {}, {})).toBe(true);
        expect(compare(fn, {}, {})).toBe(false);
    });

    test('guard: true, когда один из операндов — примитив, даже если второй — массив/дата/карта/сет/бокс', () => {
        expect(guard(1, [], {})).toBe(true);
        expect(compare(1, [], {})).toBe(false);

        expect(guard('x', new Date(), {})).toBe(true);
        expect(compare('x', new Date(), {})).toBe(false);

        expect(guard(true, new Map(), {})).toBe(true);
        expect(compare(true, new Map(), {})).toBe(false);

        expect(guard(false, new Set(), {})).toBe(true);
        expect(compare(false, new Set(), {})).toBe(false);

        expect(guard(0, new Number(0), {})).toBe(true);
        expect(compare(0, new Number(0), {})).toBe(false);
    });

    // ----------------------- GUARD: FALSY -----------------------

    test('guard: false, когда оба значения — объекты (включая массивы, даты, карты/сеты, боксы)', () => {
        expect(guard({}, { a: 1 }, {})).toBe(false);
        expect(guard([], [], {})).toBe(false);
        expect(guard(new Date(), new Date(), {})).toBe(false);
        expect(guard(new Map(), new Map(), {})).toBe(false);
        expect(guard(new Set(), new Set(), {})).toBe(false);
        expect(guard(new Number(1), new Number(2), {})).toBe(false);
        expect(guard(new String('a'), new String('b'), {})).toBe(false);
        expect(guard(new Boolean(true), new Boolean(false), {})).toBe(false);
    });

    // ----------------------- NULL / SPECIALS -----------------------

    test('null: typeof null === "object", поэтому примитив + null → guard = true; null + null → guard = false', () => {
        expect(typeof null).toBe('object');

        // примитив и null → guard true
        expect(guard(null, 0, {})).toBe(true);
        expect(compare(null, 0, {})).toBe(false);

        // оба null → оба "object" → guard false
        expect(guard(null, null, {})).toBe(false);
    });

    // ----------------------- IMMUTABILITY -----------------------

    test('кортеж заморожен', () => {
        expect(Object.isFrozen(EqualsNotObjectCase)).toBe(true);
    });
});
