import { EqualsFastCase } from '@/index.mjs';

describe('EqualsFastCase', () => {
    const [guard, compare] = EqualsFastCase;

    test('срабатывает для идентичных значений', () => {
        // NaN равны только через Object.is
        expect(guard(NaN, NaN, {})).toBe(true);
        expect(compare(NaN, NaN, {})).toBe(true);

        // Обычные примитивы
        expect(guard('abc', 'abc', {})).toBe(true);
        expect(compare('abc', 'abc', {})).toBe(true);

        const obj = {};
        expect(guard(obj, obj, {})).toBe(true);
        expect(compare(obj, obj, {})).toBe(true);
    });

    test('не срабатывает для разных значений', () => {
        expect(guard(1, 2, {})).toBe(false);
        expect(guard('a', 'b', {})).toBe(false);
        expect(guard({}, {}, {})).toBe(false);
    });

    test('отличает +0 и -0', () => {
        // === считает равными, но Object.is — нет
        expect(+0 === -0).toBe(true);
        expect(Object.is(+0, -0)).toBe(false);

        expect(guard(+0, -0, {})).toBe(false);
    });

    test('всегда возвращает true в compare, если guard прошёл', () => {
        const a = {};
        const b = a;

        expect(guard(a, b, {})).toBe(true);
        expect(compare(a, b, {})).toBe(true);
    });

    test('неизменяемость кортежа', () => {
        // Попытка изменить элемент должна падать по типам
        // а в рантайме кортеж заморожен через Object.freeze
        expect(Object.isFrozen(EqualsFastCase)).toBe(true);
    });
});
