import { EqualsMapCase } from '@/index.mjs';

describe('EqualsMapCase', () => {
    const [guard, compare] = EqualsMapCase;

    // ----------------------- GUARD -----------------------

    test('guard: true только для пар Map', () => {
        expect(guard(new Map(), new Map(), {})).toBe(true);

        expect(guard(new Map(), {} as unknown, {})).toBe(false);
        expect(guard({} as unknown, new Map(), {})).toBe(false);
        expect(guard(123 as unknown, new Map(), {})).toBe(false);
    });

    // ----------------------- FAST PATH (deep = false) -----------------------

    test('fast: одинаковые пары (примитивные ключи/значения) → true', () => {
        const a = new Map([
            ['x', 1],
            ['y', 2],
        ]);
        const b = new Map([
            ['y', 2],
            ['x', 1],
        ]);
        expect(compare(a, b, {})).toBe(true);
    });

    test('fast: разный размер → false', () => {
        const a = new Map([['x', 1]]);
        const b = new Map([
            ['x', 1],
            ['y', 2],
        ]);
        expect(compare(a, b, {})).toBe(false);
    });

    test('fast: одинаковые ключи, разные значения → false', () => {
        const a = new Map([['x', 1]]);
        const b = new Map([['x', 2]]);
        expect(compare(a, b, {})).toBe(false);
    });

    test('fast: ключи сравниваются по семантике Map.has (SameValueZero)', () => {
        const a = new Map([
            [+0, 'a'],
            [NaN, 'n'],
        ]);
        const b = new Map([
            [-0, 'a'],
            [NaN, 'n'],
        ]); // Map считает +0 и -0 равными, NaN равен NaN
        expect(compare(a, b, {})).toBe(true);
    });

    test('fast + loose: значения сравниваются через equalsPrimitive', () => {
        const a = new Map([['x', '1']]);
        const b = new Map([['x', 1]]);
        expect(compare(a, b, { loose: true })).toBe(true);
        expect(compare(a, b, { loose: false })).toBe(false);
    });

    test('fast: разные объектные ключи (по ссылке) → false', () => {
        const aKey = { id: 1 };
        const bKey = { id: 1 };
        const a = new Map([[aKey, 1]]);
        const b = new Map([[bKey, 1]]);
        // Map.has использует ссылочную идентичность для объектов
        expect(compare(a, b, {})).toBe(false);
    });

    // ----------------------- DEEP PATH (deep = true) -----------------------

    test('deep: эквивалентные объектные ключи и значения → true', () => {
        const a = new Map([
            [{ id: 1 }, { v: 10 }],
            [{ id: 2 }, { v: 20 }],
        ]);
        const b = new Map([
            [{ id: 2 }, { v: 20 }],
            [{ id: 1 }, { v: 10 }],
        ]);
        expect(compare(a, b, { deep: true, depth: 5 })).toBe(true); // false
    });

    test('deep: различие в ключах → false', () => {
        const a = new Map([[{ id: 1 }, { v: 10 }]]);
        const b = new Map([[{ id: 2 }, { v: 10 }]]);
        expect(compare(a, b, { deep: true, depth: 5 })).toBe(false);
    });

    test('deep: различие в значениях → false', () => {
        const a = new Map([[{ id: 1 }, { v: 10 }]]);
        const b = new Map([[{ id: 1 }, { v: 11 }]]);
        expect(compare(a, b, { deep: true, depth: 5 })).toBe(false);
    });

    test('deep: совпадения не переиспользуются', () => {
        const a = new Map([
            [{ k: 1 }, { x: 1 }],
            [{ k: 1 }, { x: 1 }],
        ]);
        const b = new Map([
            [{ k: 1 }, { x: 1 }],
            [{ k: 2 }, { x: 1 }],
        ]);
        expect(compare(a, b, { deep: true, depth: 5 })).toBe(false);
    });

    test('deep + loose: +0 и -0 в значениях считаются равными', () => {
        const a = new Map([[{ id: 1 }, +0]]);
        const b = new Map([[{ id: 1 }, -0]]);
        // ключи эквивалентны глубоко, значения — через equalsPrimitive(loose)
        expect(compare(a, b, { deep: true, depth: 5, loose: true })).toBe(true);
        expect(compare(a, b, { deep: true, depth: 5, loose: false })).toBe(
            false,
        );
    });

    // ----------------------- IMMUTABILITY -----------------------

    test('кортеж заморожен', () => {
        expect(Object.isFrozen(EqualsMapCase)).toBe(true);
    });
});
