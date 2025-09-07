import { EqualsWeakMapCase } from '@/index.mjs';

describe('EqualsWeakMapCase', () => {
    const [guard, compare] = EqualsWeakMapCase;

    // ----------------------- GUARD -----------------------

    test('guard: true только для пар WeakMap', () => {
        expect(guard(new WeakMap(), new WeakMap(), {})).toBe(true);

        expect(guard(new WeakMap(), new Map() as unknown, {})).toBe(false);
        expect(guard(new Map() as unknown, new WeakMap(), {})).toBe(false);
        expect(guard({}, new WeakMap(), {})).toBe(false);
        expect(guard(123 as unknown, new WeakMap(), {})).toBe(false);
        expect(guard('x' as unknown, new WeakMap(), {})).toBe(false);
    });

    // ----------------------- COMPARE -----------------------

    test('compare: всегда false для разных экземпляров WeakMap', () => {
        const a = new WeakMap<object, unknown>();
        const b = new WeakMap<object, unknown>();
        expect(compare(a, b, {})).toBe(false);
    });

    test('compare: даже при одинаково «заполненных» WeakMap возвращает false (содержимое недоступно)', () => {
        const k1 = {};
        const k2 = {};
        const a = new WeakMap<object, unknown>([
            [k1, 1],
            [k2, 2],
        ]);
        const b = new WeakMap<object, unknown>([
            [k1, 1],
            [k2, 2],
        ]);
        expect(compare(a, b, {})).toBe(false);
    });

    // NB: равенство по ссылке (одна и та же переменная) проверяет EqualsFastCase,
    // здесь мы не тестируем FastCase, поэтому не вызываем compare для одной и той же ссылки.

    // ----------------------- IMMUTABILITY -----------------------

    test('кортеж заморожен', () => {
        expect(Object.isFrozen(EqualsWeakMapCase)).toBe(true);
    });
});
