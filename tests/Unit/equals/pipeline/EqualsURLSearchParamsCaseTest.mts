import { EqualsURLSearchParamsCase } from '@/index.mjs';

describe('EqualsURLSearchParamsCase', () => {
    const [guard, compare] = EqualsURLSearchParamsCase;

    // ----------------------- GUARD -----------------------

    test('guard: true только для пар URLSearchParams', () => {
        expect(
            guard(new URLSearchParams('a=1'), new URLSearchParams('b=2'), {}),
        ).toBe(true);

        expect(guard(new URLSearchParams('a=1'), {} as unknown, {})).toBe(
            false,
        );
        expect(guard({} as unknown, new URLSearchParams('a=1'), {})).toBe(
            false,
        );
        expect(guard(123 as unknown, new URLSearchParams('a=1'), {})).toBe(
            false,
        );
    });

    // ----------------------- СРАВНЕНИЕ: порядок не важен -----------------------

    test('одинаковый набор пар в разном порядке → true', () => {
        const a = new URLSearchParams('a=1&b=2&b=3');
        const b = new URLSearchParams('b=3&a=1&b=2');
        expect(compare(a, b, {})).toBe(true);
    });

    // ----------------------- ПОВТОРЫ УЧИТЫВАЮТСЯ -----------------------

    test('разное количество повторов одного ключа → false', () => {
        const a = new URLSearchParams('x=1&x=1');
        const b = new URLSearchParams('x=1');
        expect(compare(a, b, {})).toBe(false);
    });

    test('одинаковое количество повторов, порядок значений не важен → true', () => {
        const a = new URLSearchParams('k=1&k=2&k=2');
        const b = new URLSearchParams('k=2&k=1&k=2');
        expect(compare(a, b, {})).toBe(true);
    });

    // ----------------------- РЕГИСТР И ЗНАЧЕНИЯ -----------------------

    test('разный регистр ключей → false', () => {
        const a = new URLSearchParams('Key=1');
        const b = new URLSearchParams('key=1');
        expect(compare(a, b, {})).toBe(false);
    });

    test('разные значения → false', () => {
        const a = new URLSearchParams('y=2');
        const b = new URLSearchParams('y=3');
        expect(compare(a, b, {})).toBe(false);
    });

    // ----------------------- НОРМАЛИЗАЦИЯ КОДИРОВАНИЯ -----------------------

    test('эквивалентные строки с разным URL-энкодингом → true', () => {
        // "%20" и "+" по-разному трактуются в разных контекстах; URLSearchParams нормализует значения:
        const a = new URLSearchParams('q=hello%20world');
        const b = new URLSearchParams('q=hello world');
        expect(compare(a, b, {})).toBe(true);
    });

    // ----------------------- ПУСТО ● ПОРЯДОК КЛЮЧЕЙ -----------------------

    test('пустые параметры равны', () => {
        expect(
            compare(new URLSearchParams(''), new URLSearchParams(''), {}),
        ).toBe(true);
    });

    test('отсутствующий ключ vs ключ с пустым значением → false', () => {
        const a = new URLSearchParams('');
        const b = new URLSearchParams('x=');
        expect(compare(a, b, {})).toBe(false);
    });

    test('ключ только один раз в каждом наборе, но порядок разный → true', () => {
        const a = new URLSearchParams('a=1&b=');
        const b = new URLSearchParams('b=&a=1');
        expect(compare(a, b, {})).toBe(true);
    });

    // ----------------------- IMMUTABILITY -----------------------

    test('кортеж заморожен', () => {
        expect(Object.isFrozen(EqualsURLSearchParamsCase)).toBe(true);
    });
});
