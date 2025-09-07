import { EqualsDateCase } from '@/index.mjs';

describe('EqualsDateCase', () => {
    const [guard, compare] = EqualsDateCase;

    // ----------------------- GUARD -----------------------

    test('guard: срабатывает только для пар Date', () => {
        expect(guard(new Date(), new Date(), {})).toBe(true);

        expect(guard(new Date(), '2020-01-01', {})).toBe(false);
        expect(guard('2020-01-01', new Date(), {})).toBe(false);
        expect(guard({}, new Date(), {})).toBe(false);
        expect(guard(new Date(), {}, {})).toBe(false);
        expect(guard(0, 0, {})).toBe(false);
        expect(guard(null, new Date(), {})).toBe(false);
        expect(guard(undefined, new Date(), {})).toBe(false);
    });

    // ----------------------- COMPARE (valid dates) -----------------------

    test('compare: одинаковые timestamps → true', () => {
        const d1 = new Date(1_000);
        const d2 = new Date(1_000);

        expect(guard(d1, d2, {})).toBe(true);
        expect(compare(d1, d2, {})).toBe(true);
    });

    test('compare: разные timestamps → false', () => {
        const d1 = new Date(1_000);
        const d2 = new Date(2_000);

        expect(guard(d1, d2, {})).toBe(true);
        expect(compare(d1, d2, {})).toBe(false);
    });

    test('compare: разные ссылки, но одинаковое время → true', () => {
        const d1 = new Date('2025-01-01T00:00:00.000Z');
        const d2 = new Date('2025-01-01T00:00:00.000Z');

        expect(guard(d1, d2, {})).toBe(true);
        expect(compare(d1, d2, {})).toBe(true);
    });

    // ----------------------- COMPARE (invalid dates) -----------------------

    test('compare: оба Invalid Date → true (Object.is(NaN, NaN) === true)', () => {
        const bad1 = new Date(NaN);
        const bad2 = new Date(NaN);

        expect(guard(bad1, bad2, {})).toBe(true);
        expect(Number.isNaN(bad1.getTime())).toBe(true);
        expect(Number.isNaN(bad2.getTime())).toBe(true);
        expect(compare(bad1, bad2, {})).toBe(true);
    });

    test('compare: Invalid Date vs валидная дата → false', () => {
        const bad = new Date(NaN);
        const ok = new Date(1_000);

        expect(guard(bad, ok, {})).toBe(true);
        expect(compare(bad, ok, {})).toBe(false);
    });

    // ----------------------- IMMUTABILITY -----------------------

    test('кортеж заморожен', () => {
        expect(Object.isFrozen(EqualsDateCase)).toBe(true);
    });
});
