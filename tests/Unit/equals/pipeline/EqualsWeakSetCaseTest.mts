import { EqualsWeakSetCase } from '@/index.mjs';

describe('EqualsWeakSetCase', () => {
    const [guard, compare] = EqualsWeakSetCase;

    // ----------------------- GUARD -----------------------

    test('guard: true только для пар WeakSet', () => {
        expect(guard(new WeakSet(), new WeakSet(), {})).toBe(true);

        expect(guard(new WeakSet(), new Set() as unknown, {})).toBe(false);
        expect(guard(new Set() as unknown, new WeakSet(), {})).toBe(false);
        expect(guard({}, new WeakSet(), {})).toBe(false);
        expect(guard(123 as unknown, new WeakSet(), {})).toBe(false);
        expect(guard('x' as unknown, new WeakSet(), {})).toBe(false);
    });

    // ----------------------- COMPARE -----------------------

    test('compare: всегда false для разных экземпляров WeakSet', () => {
        const a = new WeakSet<object>();
        const b = new WeakSet<object>();
        expect(compare(a, b, {})).toBe(false);
    });

    test('compare: даже при одинаково «заполненных» WeakSet возвращает false (содержимое недоступно)', () => {
        const x1 = {};
        const x2 = {};
        const a = new WeakSet<object>([x1, x2]);
        const b = new WeakSet<object>([x1, x2]);
        // Несмотря на одинаковую инициализацию, сравнение содержимого невозможно.
        expect(compare(a, b, {})).toBe(false);
    });

    // NB: равенство по ссылке (одна и та же переменная) проверяет EqualsFastCase,
    // здесь мы не тестируем FastCase, поэтому не вызываем compare для одной и той же ссылки.

    // ----------------------- IMMUTABILITY -----------------------

    test('кортеж заморожен', () => {
        expect(Object.isFrozen(EqualsWeakSetCase)).toBe(true);
    });
});
