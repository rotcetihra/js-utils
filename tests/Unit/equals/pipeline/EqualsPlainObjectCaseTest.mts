import { EqualsPlainObjectCase } from '@/index.mjs';

describe('EqualsPlainObjectCase', () => {
    const [guard, compare] = EqualsPlainObjectCase;

    // ----------------------- GUARD -----------------------

    test('guard всегда возвращает true (по договорённости пайплайна)', () => {
        expect(guard({}, {}, {})).toBe(true);
        expect(guard(123 as unknown, 'x' as unknown, {})).toBe(true);
        expect(guard(null as unknown, undefined as unknown, {})).toBe(true);
    });

    // ----------------------- КЛЮЧИ: Object.keys / Reflect.ownKeys -----------------------

    test('сравнение по Object.keys (ownKeys=false): только строковые enumerable-ключи', () => {
        const a: any = {};
        Object.defineProperty(a, 'hidden', { value: 1, enumerable: false });
        a.x = 1;

        const b: any = {};
        Object.defineProperty(b, 'hidden', { value: 1, enumerable: false });
        b.x = 1;

        expect(compare(a, b, { ownKeys: false })).toBe(true); // скрытые не участвуют
    });

    test('сравнение по Reflect.ownKeys (ownKeys=true): учитываются и символы, и ненумерируемые', () => {
        const s = Symbol('k');

        const a: any = {};
        Object.defineProperty(a, 'hidden', { value: 1, enumerable: false });
        a.x = 1;
        a[s] = 2;

        const b: any = {};
        Object.defineProperty(b, 'hidden', { value: 1, enumerable: false });
        b.x = 1;
        b[s] = 2;

        expect(compare(a, b, { ownKeys: true })).toBe(true);
    });

    test('разный набор ключей → false', () => {
        const a = { x: 1 };
        const b = { y: 1 };
        expect(compare(a, b, {})).toBe(false);
    });

    // ----------------------- ДЕСКРИПТОРЫ -----------------------

    test('compareDescriptors=false: различия в enumerable/… игнорируются', () => {
        const a: any = {};
        Object.defineProperty(a, 'x', { value: 1, enumerable: false });

        const b: any = {};
        Object.defineProperty(b, 'x', { value: 1, enumerable: true });

        expect(
            compare(a, b, { compareDescriptors: false, ownKeys: true }),
        ).toBe(true);
    });

    test('compareDescriptors=true: различия в дескрипторах → false', () => {
        const a: any = {};
        Object.defineProperty(a, 'x', { value: 1, enumerable: false });

        const b: any = {};
        Object.defineProperty(b, 'x', { value: 1, enumerable: true });

        expect(compare(a, b, { compareDescriptors: true, ownKeys: true })).toBe(
            false,
        );
    });

    test('compareDescriptors=true: различие в getter/setter → false', () => {
        const a: any = {};
        Object.defineProperty(a, 'x', {
            get: () => 1,
            enumerable: true,
            configurable: true,
        });

        const b: any = {};
        Object.defineProperty(b, 'x', {
            get: () => 1,
            set: (v: any) => void v,
            enumerable: true,
            configurable: true,
        });

        expect(compare(a, b, { compareDescriptors: true, ownKeys: true })).toBe(
            false,
        );
    });

    // ----------------------- ЗНАЧЕНИЯ: deep/loose/depth -----------------------

    test('deep=false: вложенные объекты сравниваются примитивно (по ссылке/== в зависимости от loose)', () => {
        const a = { nest: { z: 1 } };
        const b = { nest: { z: 1 } };

        // по ссылке — разные
        expect(compare(a, b, { deep: false })).toBe(false);

        // примитивные отличия (loose=false)
        const c = { v: '1' };
        const d = { v: 1 };
        expect(compare(c, d, { deep: false, loose: false })).toBe(false);
        // loose=true — допускает '1' == 1
        expect(compare(c, d, { deep: false, loose: true })).toBe(true);
    });

    test('deep=true: рекурсивное сравнение вложенных структур', () => {
        const a = { x: 1, y: { z: [1, 2, { k: '3' }] } };
        const b = { y: { z: [1, 2, { k: 3 }] }, x: 1 };

        // при loose=true и достаточной глубине — true
        expect(compare(a, b, { deep: true, depth: 10, loose: true })).toBe(
            true,
        );
        // если depth=0 — рекурсия не идёт → false (ссылки разные)
        expect(compare(a, b, { deep: true, depth: 0, loose: true })).toBe(
            false,
        );
    });

    // ----------------------- ПРОЧЕЕ -----------------------

    test('значения сравниваются только после совпадения множества ключей', () => {
        const a = { x: 1, y: 2 };
        const b = { x: 1, z: 2 };
        expect(compare(a, b, {})).toBe(false); // даже если значения похожи, ключи различны
    });

    // ----------------------- IMMUTABILITY -----------------------

    test('кортеж заморожен', () => {
        expect(Object.isFrozen(EqualsPlainObjectCase)).toBe(true);
    });
});
