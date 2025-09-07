import { EqualsURLCase } from '@/index.mjs';

describe('EqualsURLCase', () => {
    const [guard, compare] = EqualsURLCase;

    // ----------------------- GUARD -----------------------

    test('guard: true только для пар URL', () => {
        expect(guard(new URL('https://a/b'), new URL('https://a/c'), {})).toBe(
            true,
        );

        expect(guard(new URL('https://a/b'), {} as unknown, {})).toBe(false);
        expect(guard({} as unknown, new URL('https://a/b'), {})).toBe(false);
        expect(guard(123 as unknown, new URL('https://a/b'), {})).toBe(false);
    });

    // ----------------------- НОРМАЛИЗАЦИЯ href -----------------------

    test('одинаковый ресурс после нормализации: хост без регистра, стандартный порт опускается', () => {
        const a = new URL('https://example.com:443/path?x=1#h');
        const b = new URL('https://EXAMPLE.com/path?x=1#h');
        // В обоих случаях href нормализуется к одной строке
        expect(compare(a, b, {})).toBe(true);
    });

    test('пустой путь нормализуется к завершающему /', () => {
        const a = new URL('https://example.com');
        const b = new URL('https://example.com/');
        expect(a.href.endsWith('/')).toBe(true);
        expect(b.href.endsWith('/')).toBe(true);
        expect(compare(a, b, {})).toBe(true);
    });

    // ----------------------- QUERY / HASH / AUTH -----------------------

    test('порядок query-параметров учитывается (часть href)', () => {
        const a = new URL('https://example.com/?a=1&b=2');
        const b = new URL('https://example.com/?b=2&a=1');
        expect(compare(a, b, {})).toBe(false);
    });

    test('разный hash → false', () => {
        const a = new URL('https://example.com/path?x=1#h1');
        const b = new URL('https://example.com/path?x=1#h2');
        expect(compare(a, b, {})).toBe(false);
    });

    test('разные креды (username/password) → false', () => {
        const a = new URL('https://user:pass@example.com/resource');
        const b = new URL('https://user:PASS@example.com/resource');
        // Пароль — часть href, регистр значим
        expect(compare(a, b, {})).toBe(false);
    });

    // ----------------------- РАЗЛИЧИЯ В ПОРТЕ/ПРОТОКОЛЕ/ПУТИ -----------------------

    test('разные пути → false', () => {
        const a = new URL('https://example.com/a');
        const b = new URL('https://example.com/b');
        expect(compare(a, b, {})).toBe(false);
    });

    test('нестандартный порт учитывается в href', () => {
        const a = new URL('https://example.com:444/path');
        const b = new URL('https://example.com/path');
        expect(compare(a, b, {})).toBe(false);
    });

    test('разный протокол → false', () => {
        const a = new URL('http://example.com/');
        const b = new URL('https://example.com/');
        expect(compare(a, b, {})).toBe(false);
    });

    // ----------------------- ПУСТЫЕ/БАЗОВЫЕ -----------------------

    test('полностью совпадающий href → true', () => {
        const a = new URL('https://example.com/x?y=1#z');
        const b = new URL('https://example.com/x?y=1#z');
        expect(compare(a, b, {})).toBe(true);
    });

    // ----------------------- IMMUTABILITY -----------------------

    test('кортеж заморожен', () => {
        expect(Object.isFrozen(EqualsURLCase)).toBe(true);
    });
});
