import { EqualsFunctionCase } from '@/index.mjs';

describe('EqualsFunctionCase', () => {
    const [guard, compare] = EqualsFunctionCase;

    // ----------------------- GUARD -----------------------

    test('guard: true только для пар функций (включая async/generator)', () => {
        function regular() {}
        const arrow = () => {};
        async function asyncFn() {
            return 1;
        }
        function* gen() {
            yield 1;
        }

        expect(guard(regular, arrow, {})).toBe(true);
        expect(guard(asyncFn, gen, {})).toBe(true);

        expect(guard(regular, {} as unknown, {})).toBe(false);
        expect(guard({} as unknown, arrow, {})).toBe(false);
        expect(guard(123 as unknown, regular, {})).toBe(false);
        expect(guard('x' as unknown, regular, {})).toBe(false);
    });

    // ----------------------- COMPARE -----------------------

    test('compare: всегда false для разных функций', () => {
        const f1 = () => 1;
        const f2 = () => 1;
        expect(compare(f1, f2, {})).toBe(false);
    });

    test('compare: bound-функции с одинаковой логикой но разными ссылками → false', () => {
        function base(this: any) {
            return this?.v ?? 0;
        }
        const b1 = base.bind({ v: 1 });
        const b2 = base.bind({ v: 1 });
        expect(compare(b1, b2, {})).toBe(false);
    });

    test('compare: async/генераторы с одинаковым телом но разными ссылками → false', () => {
        async function a1() {
            return 1;
        }
        async function a2() {
            return 1;
        }
        function* g1() {
            yield 1;
        }
        function* g2() {
            yield 1;
        }

        expect(compare(a1, a2, {})).toBe(false);
        expect(compare(g1, g2, {})).toBe(false);
    });

    // NB: равенство по ссылке (одна и та же переменная) перехватывает EqualsFastCase,
    // здесь мы не проверяем FastCase, поэтому не вызываем compare с одинаковыми ссылками.

    // ----------------------- IMMUTABILITY -----------------------

    test('кортеж заморожен', () => {
        expect(Object.isFrozen(EqualsFunctionCase)).toBe(true);
    });
});
