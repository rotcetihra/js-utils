import { EqualsPromiseCase } from '@/index.mjs';

describe('EqualsPromiseCase', () => {
    const [guard, compare] = EqualsPromiseCase;

    // ----------------------- GUARD -----------------------

    test('guard: true только для пар Promise', () => {
        expect(guard(Promise.resolve(1), Promise.resolve(2), {})).toBe(true);

        // thenable, но не Promise — guard должен быть false
        const thenable = { then: (_: any) => void 0 };
        expect(guard(thenable as unknown, Promise.resolve(1), {})).toBe(false);

        expect(guard(Promise.resolve(1), {} as unknown, {})).toBe(false);
        expect(guard({} as unknown, Promise.resolve(1), {})).toBe(false);
        expect(guard(123 as unknown, Promise.resolve(1), {})).toBe(false);
    });

    // ----------------------- COMPARE -----------------------

    test('compare: разные Promise (даже с одинаковым результатом) → false', () => {
        const a = Promise.resolve(42);
        const b = Promise.resolve(42);
        expect(compare(a, b, {})).toBe(false);
    });

    test('compare: разные pending Promise → false', () => {
        const a = new Promise<number>(() => {
            /* forever pending */
        });
        const b = new Promise<number>(() => {
            /* forever pending */
        });
        expect(compare(a, b, {})).toBe(false);
    });

    test('compare: разные rejected Promise → false', () => {
        const a = Promise.reject(new Error('x'));
        const b = Promise.reject(new Error('x'));
        // подавим unhandled rejection предупреждения
        a.catch(() => void 0);
        b.catch(() => void 0);
        expect(compare(a, b, {})).toBe(false);
    });

    // NB: равенство по ссылке (один и тот же экземпляр) перехватывается EqualsFastCase,
    // здесь мы не проверяем FastCase, поэтому не вызываем compare с одинаковой ссылкой.

    // ----------------------- IMMUTABILITY -----------------------

    test('кортеж заморожен', () => {
        expect(Object.isFrozen(EqualsPromiseCase)).toBe(true);
    });
});
