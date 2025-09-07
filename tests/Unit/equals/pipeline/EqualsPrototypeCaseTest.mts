import { EqualsPrototypeCase } from '@/index.mjs';

describe('EqualsPrototypeCase', () => {
    const [guard, compare] = EqualsPrototypeCase;

    test('разные классы с одинаковыми полями → guard: true, compare: false', () => {
        class A {
            x = 1;
        }
        class B {
            x = 1;
        }
        const a = new A();
        const b = new B();

        expect(guard(a, b, {})).toBe(true);
        expect(compare(a, b, {})).toBe(false);
    });

    test('{} vs {} → одинаковый прототип Object.prototype → guard: false', () => {
        const o1 = {};
        const o2 = {};
        expect(guard(o1, o2, {})).toBe(false);
    });

    test('Array vs Object → разные прототипы → guard: true, compare: false', () => {
        const arr: unknown = [];
        const obj: unknown = {};
        expect(guard(arr, obj, {})).toBe(true);
        expect(compare(arr, obj, {})).toBe(false);
    });

    test('Object.create(null) vs {} → null-прототип против Object.prototype → guard: true, compare: false', () => {
        const dict = Object.create(null);
        const obj = {};
        expect(guard(dict, obj, {})).toBe(true);
        expect(compare(dict, obj, {})).toBe(false);
    });

    test('два объекта с null-прототипом → guard: false', () => {
        const a = Object.create(null);
        const b = Object.create(null);
        expect(guard(a, b, {})).toBe(false);
    });

    test('две инстанции одного класса → одинаковый прототип → guard: false', () => {
        class C {
            y = 2;
        }
        const c1 = new C();
        const c2 = new C();
        expect(guard(c1, c2, {})).toBe(false);
    });

    test('кортеж заморожен', () => {
        expect(Object.isFrozen(EqualsPrototypeCase)).toBe(true);
    });
});
