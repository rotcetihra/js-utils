import { isBoxedString } from '@/index.mjs';

describe('isBoxedString', () => {
    test('возвращает true для объектных (боксированных) строк', () => {
        expect(isBoxedString(new String('hello'))).toBe(true);
        expect(isBoxedString(new String(''))).toBe(true);

        // Object(...) для строки создаёт именно объект-бокс
        // (эквивалентно new String(...))
        expect(isBoxedString(Object('hi'))).toBe(true);
    });

    test('возвращает false для примитивных строк и вызова String(...) без new', () => {
        expect(isBoxedString('hello')).toBe(false);
        expect(isBoxedString('')).toBe(false);

        // String(...) без new возвращает примитив
        expect(isBoxedString(String('ok'))).toBe(false);
    });

    test('возвращает false для других примитивов', () => {
        expect(isBoxedString(42)).toBe(false);
        expect(isBoxedString(true)).toBe(false);
        expect(isBoxedString(Symbol('s'))).toBe(false);
        expect(isBoxedString(10n)).toBe(false);
        expect(isBoxedString(null)).toBe(false);
        expect(isBoxedString(undefined)).toBe(false);
    });

    test('возвращает false для объектных обёрток других типов', () => {
        expect(isBoxedString(new Number(1))).toBe(false);
        expect(isBoxedString(new Boolean(false))).toBe(false);
        expect(isBoxedString(new Date())).toBe(false);
        expect(isBoxedString(/re/)).toBe(false);
        expect(isBoxedString([])).toBe(false);
        expect(isBoxedString({})).toBe(false);
        expect(isBoxedString(Object(1))).toBe(false); // Number-объект
        expect(isBoxedString(Object(false))).toBe(false); // Boolean-объект
    });

    test('возвращает false для функций и классов', () => {
        function fn() {
            /* noop */
        }
        class C {}
        expect(isBoxedString(fn)).toBe(false);
        expect(isBoxedString(C)).toBe(false);
        expect(isBoxedString(new C())).toBe(false);
    });

    test('type guard корректно сужает тип до String', () => {
        // Эта функция примет только объект-бокс строки
        const acceptBoxed = (v: String) => {
            // valueOf() вернёт примитивную строку
            expect(typeof v.valueOf()).toBe('string');
        };

        const candidates: unknown[] = [
            new String('x'),
            'y',
            new Number(1),
            Object('z'),
            0,
            null,
            undefined,
        ];

        for (const v of candidates) {
            if (isBoxedString(v)) {
                // Ветвь должна типизироваться как String
                acceptBoxed(v);
            } else {
                // Здесь гарантированно не String-объект
                expect(v instanceof String).toBe(false);
            }
        }
    });
});
