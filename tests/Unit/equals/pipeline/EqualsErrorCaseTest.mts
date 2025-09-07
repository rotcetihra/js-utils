import { EqualsErrorCase } from '@/index.mjs';

describe('EqualsErrorCase', () => {
    const [guard, compare] = EqualsErrorCase;

    // ----------------------- GUARD -----------------------

    test('guard: true только для пар Error (включая подклассы)', () => {
        expect(guard(new Error('x'), new Error('y'), {})).toBe(true);
        expect(guard(new TypeError('x'), new RangeError('y'), {})).toBe(true);

        expect(guard(new Error('x'), {} as unknown, {})).toBe(false);
        expect(guard({} as unknown, new Error('x'), {})).toBe(false);
        expect(guard(123 as unknown, new Error('x'), {})).toBe(false);
    });

    // ----------------------- NAME / MESSAGE -----------------------

    test('одинаковые name и message → true', () => {
        const a = new TypeError('boom');
        const b = new TypeError('boom');
        expect(compare(a, b, {})).toBe(true);
    });

    test('разный name → false', () => {
        const a = new Error('boom');
        const b = new TypeError('boom');
        expect(compare(a, b, {})).toBe(false);
    });

    test('разный message → false', () => {
        const a = new Error('a');
        const b = new Error('b');
        expect(compare(a, b, {})).toBe(false);
    });

    // ----------------------- CAUSE: ПРИСУТСТВИЕ -----------------------

    test('наличие cause должно совпадать', () => {
        const a: any = new Error('e');
        a.cause = 1;
        const b: any = new Error('e');
        expect(compare(a, b, {})).toBe(false);
    });

    // ----------------------- CAUSE: DEEP=false (примитивно) -----------------------

    test('cause: deep=false сравнивает примитивно (с учетом loose)', () => {
        const a: any = new Error('e');
        a.cause = '1';
        const b: any = new Error('e');
        b.cause = 1;

        expect(compare(a, b, { deep: false, loose: false })).toBe(false);
        expect(compare(a, b, { deep: false, loose: true })).toBe(true);
    });

    // ----------------------- CAUSE: DEEP=true (рекурсивно) -----------------------

    test('cause: deep=true сравнивает рекурсивно структуру', () => {
        const a: any = new Error('e');
        a.cause = { code: 1, nested: { ok: true } };
        const b: any = new Error('e');
        b.cause = { nested: { ok: true }, code: 1 };

        expect(compare(a, b, { deep: true, depth: 5 })).toBe(true);
    });

    test('cause: deep=true с различиями в глубине → false', () => {
        const a: any = new Error('e');
        a.cause = { code: 1, nested: { ok: true } };
        const b: any = new Error('e');
        b.cause = { code: 1, nested: { ok: false } };

        expect(compare(a, b, { deep: true, depth: 5 })).toBe(false);
    });

    test('cause: deep=true но depth=0 → сравнение не уходит вглубь', () => {
        const a: any = new Error('e');
        a.cause = { code: 1 };
        const b: any = new Error('e');
        b.cause = { code: 1 };

        // при depth=0 рекурсия не запускается → сравнение пойдёт примитивно (по ссылке) и даст false
        expect(compare(a, b, { deep: true, depth: 0 })).toBe(false);
    });

    // ----------------------- STACK ИГНОРИРУЕТСЯ -----------------------

    test('stack игнорируется', () => {
        const a = new Error('e');
        const b = new Error('e');
        a.stack = 'S1';
        b.stack = 'S2';
        expect(compare(a, b, {})).toBe(true);
    });

    // ----------------------- МЕЛОЧИ -----------------------

    test('подклассы Error с одинаковым name/message равны', () => {
        class MyErr extends Error {
            constructor(m: string) {
                super(m);
                this.name = 'MyErr';
            }
        }
        const a = new MyErr('x');
        const b = new MyErr('x');
        expect(compare(a, b, {})).toBe(true);
    });

    // ----------------------- IMMUTABILITY -----------------------

    test('кортеж заморожен', () => {
        expect(Object.isFrozen(EqualsErrorCase)).toBe(true);
    });
});
