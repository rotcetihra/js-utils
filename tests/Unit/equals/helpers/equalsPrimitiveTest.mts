import { equalsPrimitive } from '@/index.mjs';

describe('equalsPrimitive (strict/Object.is vs loose/==)', () => {
    // ---------------------- STRICT (по умолчанию) ----------------------

    test('strict: базовая равенство примитивов', () => {
        expect(equalsPrimitive(1, 1)).toBe(true);
        expect(equalsPrimitive('a', 'a')).toBe(true);
        expect(equalsPrimitive(true, true)).toBe(true);

        expect(equalsPrimitive(1, 2)).toBe(false);
        expect(equalsPrimitive('a', 'b')).toBe(false);
        expect(equalsPrimitive(true, false)).toBe(false);
    });

    test('strict: NaN равен самому себе, +0 и -0 различаются', () => {
        expect(Object.is(NaN, NaN)).toBe(true);
        expect(equalsPrimitive(NaN, NaN)).toBe(true);

        expect(+0 === -0).toBe(true); // поведение ===
        expect(Object.is(+0, -0)).toBe(false);
        expect(equalsPrimitive(+0, -0)).toBe(false);
    });

    test('strict: разные ссылки на объекты и боксы не равны', () => {
        expect(equalsPrimitive({}, {})).toBe(false);
        expect(equalsPrimitive(new Number(1) as unknown, 1)).toBe(false);
        expect(equalsPrimitive(new String('x') as unknown, 'x')).toBe(false);
        expect(equalsPrimitive(new Boolean(true) as unknown, true)).toBe(false);
    });

    test('strict: два одинаковых по значению Date не равны (разные объекты)', () => {
        expect(
            equalsPrimitive(
                new Date(1000) as unknown,
                new Date(1000) as unknown,
            ),
        ).toBe(false);
    });

    test('strict: символы равны только по ссылке', () => {
        const s1 = Symbol('x');
        const s2 = Symbol('x');
        expect(equalsPrimitive(s1, s1)).toBe(true);
        expect(equalsPrimitive(s1, s2)).toBe(false);
    });

    // --------------------------- LOOSE (==) ----------------------------

    test('loose: число и строка, true/1, null/undefined, ""/0', () => {
        const opts = true; // loose = true
        expect(equalsPrimitive(1, '1', opts)).toBe(true);
        expect(equalsPrimitive(true, 1, opts)).toBe(true);
        expect(equalsPrimitive(null, undefined, opts)).toBe(true);
        expect(equalsPrimitive('', 0, opts)).toBe(true);
        expect(equalsPrimitive(' \t\n', 0, opts)).toBe(true); // whitespace → 0
    });

    test('loose: NaN всё ещё не равен самому себе', () => {
        expect((NaN as any) == (NaN as any)).toBe(false);
        expect(equalsPrimitive(NaN, NaN, true)).toBe(false);
    });

    test('loose: +0 и -0 считаются равными', () => {
        expect(+0 == -0).toBe(true);
        expect(equalsPrimitive(+0, -0, true)).toBe(true);
    });

    test('loose: объекты сравниваются по приведению к примитиву/ссылке', () => {
        // одинаковые ссылки → true
        const obj = {};
        expect(equalsPrimitive(obj, obj, true)).toBe(true);

        // разные объекты → false
        expect(equalsPrimitive({}, {}, true)).toBe(false);

        const d1 = new Date(1000);
        const d2 = new Date(1000);

        // РАЗНЫЕ объекты Date: даже в loose — false
        expect(equalsPrimitive(d1 as unknown, d2 as unknown, true)).toBe(false);

        // Date vs Number: для == тоже false
        expect(equalsPrimitive(d1 as unknown, 1000 as unknown, true)).toBe(
            false,
        );

        // Если хотите сравнить «по таймштампу», сравнивайте примитивы:
        expect(equalsPrimitive(d1.valueOf(), 1000, true)).toBe(true);
    });

    test('loose: боксы и соответствующие примитивы считаются равными', () => {
        expect(equalsPrimitive(new Number(1) as unknown, 1, true)).toBe(true);
        expect(equalsPrimitive(new String('x') as unknown, 'x', true)).toBe(
            true,
        );
        expect(equalsPrimitive(new Boolean(true) as unknown, true, true)).toBe(
            true,
        );
    });

    // --------------------------- NEGATIVE ------------------------------

    test('loose: случаи, которые не равны по ==', () => {
        expect(equalsPrimitive('2', true, true)).toBe(false); // Number('2') == 1? → false
        expect(equalsPrimitive('foo', 0, true)).toBe(false); // ToNumber('foo') → NaN → false
        expect(equalsPrimitive([], {}, true)).toBe(false);
    });
});
