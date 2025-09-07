import { EqualsArrayBufferCase } from '@/index.mjs';

describe('EqualsArrayBufferCase', () => {
    const [guard, compare] = EqualsArrayBufferCase;

    // ----------------------- GUARD -----------------------

    test('guard: true только для пар ArrayBuffer', () => {
        const buf = new ArrayBuffer(4);
        expect(guard(buf, buf, {})).toBe(true);

        // не ArrayBuffer
        expect(
            guard(
                new ArrayBuffer(2),
                new DataView(new ArrayBuffer(2)) as unknown,
                {},
            ),
        ).toBe(false);
        expect(
            guard(
                new DataView(new ArrayBuffer(2)) as unknown,
                new ArrayBuffer(2),
                {},
            ),
        ).toBe(false);
        expect(guard({}, new ArrayBuffer(2), {})).toBe(false);
        expect(guard(123 as unknown, new ArrayBuffer(2), {})).toBe(false);
        expect(guard('x' as unknown, new ArrayBuffer(2), {})).toBe(false);
    });

    // ----------------------- COMPARE: базовые случаи -----------------------

    test('compare: одинаковое содержимое → true', () => {
        const buf1 = new Uint8Array([1, 2, 3]).buffer;
        const buf2 = new Uint8Array([1, 2, 3]).buffer;
        expect(compare(buf1, buf2, {})).toBe(true);
    });

    test('compare: разное содержимое → false', () => {
        const buf1 = new Uint8Array([1, 2, 3]).buffer;
        const buf2 = new Uint8Array([1, 2, 4]).buffer;
        expect(compare(buf1, buf2, {})).toBe(false);
    });

    test('compare: разная длина → false', () => {
        const buf1 = new Uint8Array([1, 2, 3]).buffer;
        const buf2 = new Uint8Array([1, 2]).buffer;
        expect(compare(buf1, buf2, {})).toBe(false);
    });

    test('compare: пустые буферы равны', () => {
        const buf1 = new ArrayBuffer(0);
        const buf2 = new ArrayBuffer(0);
        expect(compare(buf1, buf2, {})).toBe(true);
    });

    test('compare: одинаковая длина, различие в одном байте → false', () => {
        const a = new Uint8Array([0, 0, 1]).buffer;
        const b = new Uint8Array([0, 0, 2]).buffer;
        expect(compare(a, b, {})).toBe(false);
    });

    // ----------------------- IMMUTABILITY -----------------------

    test('кортеж заморожен', () => {
        expect(Object.isFrozen(EqualsArrayBufferCase)).toBe(true);
    });
});
