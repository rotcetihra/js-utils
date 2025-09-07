import { EqualsLooseCase } from '@/index.mjs';

describe('EqualsLooseCase — loose (==) guard & compare', () => {
    const [guard, compare] = EqualsLooseCase;

    // ----------------------- BASE BEHAVIOR -----------------------

    test('guard не срабатывает, когда loose=false', () => {
        expect(guard(1, '1', { loose: false })).toBe(false);
        expect(guard(true, 1, { loose: false })).toBe(false);
        expect(guard(null, undefined, { loose: false })).toBe(false);
        expect(guard('', 0, { loose: false })).toBe(false);
    });

    test('guard срабатывает при loose=true, если значения равны по ==', () => {
        expect(guard(1, '1', { loose: true })).toBe(true);
        expect(guard(true, 1, { loose: true })).toBe(true);
        expect(guard(null, undefined, { loose: true })).toBe(true);
        expect(guard('', 0, { loose: true })).toBe(true);
        expect(guard(' \t\n', 0, { loose: true })).toBe(true); // whitespace → 0
        expect(guard('0', false, { loose: true })).toBe(true);
    });

    test('compare всегда возвращает true, если guard прошёл', () => {
        const opts = { loose: true };
        expect(guard(1, '1', opts)).toBe(true);
        expect(compare(1, '1', opts)).toBe(true);

        expect(guard(null, undefined, opts)).toBe(true);
        expect(compare(null, undefined, opts)).toBe(true);
    });

    // ----------------------- EDGE CASES: NaN, ±0 -----------------------

    test('NaN не равен самому себе по == даже при loose', () => {
        const opts = { loose: true };
        expect((NaN as any) == (NaN as any)).toBe(false);
        expect(guard(NaN, NaN, opts)).toBe(false);
    });

    test('+0 и -0 равны по == при loose', () => {
        const opts = { loose: true };
        expect(+0 == -0).toBe(true);
        expect(guard(+0, -0, opts)).toBe(true);
        expect(compare(+0, -0, opts)).toBe(true);
    });

    // ----------------------- SYMBOL SAFETY -----------------------

    test('symbol vs string/number/boolean: guard НЕ срабатывает и не бросает', () => {
        const s = Symbol('x');
        const opts = { loose: true };

        expect(() => guard(s, 'x', opts)).not.toThrow();
        expect(guard(s, 'x', opts)).toBe(false);

        expect(() => guard('x', s, opts)).not.toThrow();
        expect(guard('x', s, opts)).toBe(false);

        expect(() => guard(s, 1, opts)).not.toThrow();
        expect(guard(s, 1, opts)).toBe(false);

        expect(() => guard(false, s, opts)).not.toThrow();
        expect(guard(false, s, opts)).toBe(false);
    });

    test('symbol vs symbol: guard НЕ срабатывает (идентичность символов решается FastCase, не здесь)', () => {
        const s1 = Symbol('id');
        const s2 = Symbol('id');
        const opts = { loose: true };

        expect(guard(s1, s2, opts)).toBe(false);
        expect(guard(s1, s1, opts)).toBe(false);
    });

    // ----------------------- OBJECTS & BOXED PRIMITIVES -----------------------

    test('объекты: равны по == только по ссылке; разные объекты → guard=false', () => {
        const opts = { loose: true };
        const obj = {};
        expect(guard(obj, obj, opts)).toBe(true); // одна и та же ссылка → (obj == obj) true
        expect(compare(obj, obj, opts)).toBe(true);

        expect(guard({}, {}, opts)).toBe(false); // разные ссылки → ({} == {}) false
    });

    test('боксированные примитивы и соответствующие примитивы равны по ==', () => {
        const opts = { loose: true };
        expect(guard(new Number(1), 1, opts)).toBe(true);
        expect(compare(new Number(1), 1, opts)).toBe(true);

        expect(guard(new String('x'), 'x', opts)).toBe(true);
        expect(compare(new String('x'), 'x', opts)).toBe(true);

        expect(guard(new Boolean(true), true, opts)).toBe(true);
        expect(compare(new Boolean(true), true, opts)).toBe(true);
    });

    test('Date: два разных Date по == НЕ равны; Date vs number по == тоже НЕ равны', () => {
        const opts = { loose: true };
        const d1 = new Date(1000);
        const d2 = new Date(1000);

        expect(guard(d1, d2, opts)).toBe(false); // разные объекты → false
        expect(guard(d1, 1000 as unknown, opts)).toBe(false); // Date == number → false
    });

    // ----------------------- NEGATIVE LOOSE CASES -----------------------

    test('некоторые пары не равны по == даже при loose', () => {
        const opts = { loose: true };
        expect(guard('2', true, opts)).toBe(false); // Number('2') == 1 ? false
        expect(guard('foo', 0, opts)).toBe(false); // ToNumber('foo') → NaN → false
        expect(guard([], {}, opts)).toBe(false); // [] == {} → false
    });

    // ----------------------- ORTHOGONALITY & IMMUTABILITY -----------------------

    test('ортогональность: другие опции не влияют на активацию кейса', () => {
        const opts = {
            loose: true,
            deep: true,
            ownKeys: true,
            compareDescriptors: true,
            depth: 7,
        };
        expect(guard(1, '1', opts)).toBe(true);
        expect(compare(1, '1', opts)).toBe(true);
    });

    test('кортеж заморожен', () => {
        expect(Object.isFrozen(EqualsLooseCase)).toBe(true);
    });
});
