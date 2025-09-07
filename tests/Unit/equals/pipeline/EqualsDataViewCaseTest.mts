import { EqualsDataViewCase } from '@/index.mjs';

describe('EqualsDataViewCase', () => {
    const [guard, compare] = EqualsDataViewCase;

    // ----------------------- GUARD -----------------------

    test('guard: true только для пар DataView', () => {
        const dv = new DataView(new ArrayBuffer(4));
        expect(guard(dv, dv, {})).toBe(true);

        expect(guard(dv, new ArrayBuffer(4) as unknown, {})).toBe(false);
        expect(guard(new ArrayBuffer(4) as unknown, dv, {})).toBe(false);
        expect(guard({}, dv, {})).toBe(false);
        expect(guard(123 as unknown, dv, {})).toBe(false);
    });

    // ----------------------- COMPARE -----------------------

    test('одинаковое содержимое и одинаковое окно → true', () => {
        const buf1 = new Uint8Array([10, 20, 30, 40]).buffer;
        const buf2 = new Uint8Array([10, 20, 30, 40]).buffer;

        const dv1 = new DataView(buf1, 1, 2); // [20, 30]
        const dv2 = new DataView(buf2, 1, 2); // [20, 30]

        expect(compare(dv1, dv2, {})).toBe(true);
    });

    test('разное содержимое при одинаковом окне → false', () => {
        const buf1 = new Uint8Array([10, 20, 30]).buffer;
        const buf2 = new Uint8Array([10, 25, 30]).buffer;

        const dv1 = new DataView(buf1, 0, 3);
        const dv2 = new DataView(buf2, 0, 3);

        expect(compare(dv1, dv2, {})).toBe(false);
    });

    test('разная длина окна → false', () => {
        const buf1 = new Uint8Array([1, 2, 3]).buffer;
        const buf2 = new Uint8Array([1, 2, 3]).buffer;

        const dv1 = new DataView(buf1, 0, 3);
        const dv2 = new DataView(buf2, 0, 2);

        expect(compare(dv1, dv2, {})).toBe(false);
    });

    test('разное смещение окна → false', () => {
        const buf = new Uint8Array([1, 2, 3, 4]).buffer;

        const dv1 = new DataView(buf, 0, 2); // [1, 2]
        const dv2 = new DataView(buf, 1, 2); // [2, 3]

        expect(compare(dv1, dv2, {})).toBe(false);
    });

    test('пустые окна одинаковой длины → true', () => {
        const buf1 = new ArrayBuffer(0);
        const buf2 = new ArrayBuffer(0);

        const dv1 = new DataView(buf1);
        const dv2 = new DataView(buf2);

        expect(compare(dv1, dv2, {})).toBe(true);
    });

    // ----------------------- IMMUTABILITY -----------------------

    test('кортеж заморожен', () => {
        expect(Object.isFrozen(EqualsDataViewCase)).toBe(true);
    });
});
