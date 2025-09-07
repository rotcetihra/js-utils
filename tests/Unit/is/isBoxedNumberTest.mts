import { isBoxedNumber } from '@/index.mjs';

describe('isBoxedNumber', () => {
    test('возвращает true для объектных (боксированных) чисел', () => {
        expect(isBoxedNumber(new Number(42))).toBe(true);
        expect(isBoxedNumber(new Number(NaN))).toBe(true);
        expect(isBoxedNumber(new Number(Infinity))).toBe(true);

        // Object(…) от числа → объект-бокс
        expect(isBoxedNumber(Object(123))).toBe(true);
    });

    test('возвращает false для примитивных чисел и вызова Number(...) без new', () => {
        expect(isBoxedNumber(42)).toBe(false);
        expect(isBoxedNumber(NaN)).toBe(false);
        expect(isBoxedNumber(Infinity)).toBe(false);
        expect(isBoxedNumber(Number(10))).toBe(false); // вернёт примитив
    });

    test('возвращает false для других примитивов', () => {
        expect(isBoxedNumber('42')).toBe(false);
        expect(isBoxedNumber(true)).toBe(false);
        expect(isBoxedNumber(null)).toBe(false);
        expect(isBoxedNumber(undefined)).toBe(false);
        expect(isBoxedNumber(10n)).toBe(false);
        expect(isBoxedNumber(Symbol('n'))).toBe(false);
    });

    test('возвращает false для объектных обёрток других типов', () => {
        expect(isBoxedNumber(new String('123'))).toBe(false);
        expect(isBoxedNumber(new Boolean(false))).toBe(false);
        expect(isBoxedNumber(new Date())).toBe(false);
        expect(isBoxedNumber(/re/)).toBe(false);
        expect(isBoxedNumber([])).toBe(false);
        expect(isBoxedNumber({})).toBe(false);
        expect(isBoxedNumber(Object('str'))).toBe(false);
        expect(isBoxedNumber(Object(true))).toBe(false);
    });

    test('возвращает false для функций и классов', () => {
        function fn() {}
        class C {}
        expect(isBoxedNumber(fn)).toBe(false);
        expect(isBoxedNumber(C)).toBe(false);
        expect(isBoxedNumber(new C())).toBe(false);
    });

    test('type guard корректно сужает тип до Number', () => {
        const acceptBoxed = (v: Number) => {
            // valueOf() вернёт примитивное число
            expect(typeof v.valueOf()).toBe('number');
        };

        const candidates: unknown[] = [
            new Number(1),
            2,
            new String('3'),
            Object(4),
            null,
            undefined,
        ];

        for (const v of candidates) {
            if (isBoxedNumber(v)) {
                acceptBoxed(v); // здесь v гарантированно Number-объект
            } else {
                expect(v instanceof Number).toBe(false);
            }
        }
    });
});
