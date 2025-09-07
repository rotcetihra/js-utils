import { EqualsSetCase } from '@/index.mjs';

describe('EqualsSetCase', () => {
    const [guard, compare] = EqualsSetCase;

    // ----------------------- GUARD -----------------------

    test('guard: true только для пар Set', () => {
        expect(guard(new Set(), new Set(), {})).toBe(true);

        expect(guard(new Set(), [] as unknown, {})).toBe(false);
        expect(guard([] as unknown, new Set(), {})).toBe(false);
        expect(guard(123 as unknown, new Set(), {})).toBe(false);
        expect(guard(new Set(), {} as unknown, {})).toBe(false);
    });

    // ----------------------- FAST PATH (deep = false) -----------------------
    // fast-путь использует Set.has и тем самым семантику SameValueZero:
    //   +0 и -0 равны, NaN равен NaN

    test('fast: одинаковые примитивы (порядок не важен) → true', () => {
        const a = new Set([1, 2, 3]);
        const b = new Set([3, 2, 1]);
        expect(compare(a, b, {})).toBe(true);
    });

    test('fast: разный размер → false', () => {
        const a = new Set([1, 2]);
        const b = new Set([1, 2, 3]);
        expect(compare(a, b, {})).toBe(false);
    });

    test('fast: разные элементы → false', () => {
        const a = new Set([1, 2, 3]);
        const b = new Set([1, 2, 4]);
        expect(compare(a, b, {})).toBe(false);
    });

    test('fast: +0 и -0 считаются равными (SameValueZero)', () => {
        const a = new Set([+0]);
        const b = new Set([-0]);
        expect(compare(a, b, {})).toBe(true);
    });

    test('fast: NaN и NaN считаются равными (SameValueZero)', () => {
        const a = new Set([NaN]);
        const b = new Set([NaN]);
        expect(compare(a, b, {})).toBe(true);
    });

    test('fast: разные ссылочные объекты → false', () => {
        const a = new Set([{ x: 1 }]);
        const b = new Set([{ x: 1 }]);
        expect(compare(a, b, {})).toBe(false);
    });

    // ----------------------- DEEP PATH (deep = true) -----------------------
    // deep-путь строит биекцию по equals(nextOptions): порядок не важен, элементы матчатся единожды

    test('deep: эквивалентные объекты (порядок не важен) → true', () => {
        const a = new Set([{ x: 1 }, { y: 2 }]);
        const b = new Set([{ y: 2 }, { x: 1 }]);
        expect(compare(a, b, { deep: true, depth: 5 })).toBe(true);
    });

    test('deep: разные объекты → false', () => {
        const a = new Set([{ x: 1 }]);
        const b = new Set([{ x: 2 }]);
        expect(compare(a, b, { deep: true, depth: 5 })).toBe(false);
    });

    test('deep: совпадения не переиспользуются (биекция обязательна) → false', () => {
        const a = new Set([{ v: 1 }, { v: 1 }]);
        const b = new Set([{ v: 1 }, { v: 2 }]);
        expect(compare(a, b, { deep: true, depth: 5 })).toBe(false);
    });

    test('deep + loose: "1" и 1 внутри объектов считаются равными', () => {
        const a = new Set([{ v: '1' }]);
        const b = new Set([{ v: 1 }]);
        expect(compare(a, b, { deep: true, depth: 5, loose: true })).toBe(true);
        expect(compare(a, b, { deep: true, depth: 5, loose: false })).toBe(
            false,
        );
    });

    test('deep: вложенные структуры сравниваются рекурсивно до depth', () => {
        const a = new Set([{ nest: [1, { k: '3' }] }]);
        const b = new Set([{ nest: [1, { k: 3 }] }]);

        // хватает глубины и включен loose → true
        expect(compare(a, b, { deep: true, depth: 10, loose: true })).toBe(
            true,
        );

        // depth=0 → рекурсия не идёт → false (ссылки разные в глубине)
        expect(compare(a, b, { deep: true, depth: 0, loose: true })).toBe(
            false,
        );
    });

    test('deep: различие +0/-0 учитывается (strict) и игнорируется (loose)', () => {
        const a = new Set([{ z: +0 }]);
        const b = new Set([{ z: -0 }]);
        expect(compare(a, b, { deep: true, depth: 5, loose: false })).toBe(
            false,
        );
        expect(compare(a, b, { deep: true, depth: 5, loose: true })).toBe(true);
    });

    test('deep: NaN внутри объектов считается равным NaN', () => {
        const a = new Set([{ n: NaN }]);
        const b = new Set([{ n: NaN }]);
        expect(compare(a, b, { deep: true, depth: 5 })).toBe(true);
    });

    // ----------------------- КРАЕВЫЕ СЛУЧАИ -----------------------

    test('пустые множества равны', () => {
        expect(compare(new Set(), new Set(), {})).toBe(true);
    });

    test('разный тип элементов (примитив vs объект) → false (fast)', () => {
        const a = new Set([1]);
        const b = new Set([{ value: 1 }]);
        expect(compare(a, b, {})).toBe(false);
    });

    // ----------------------- IMMUTABILITY -----------------------

    test('кортеж заморожен', () => {
        expect(Object.isFrozen(EqualsSetCase)).toBe(true);
    });
});
