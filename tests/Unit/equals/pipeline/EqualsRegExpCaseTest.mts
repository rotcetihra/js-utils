import { EqualsRegExpCase } from '@/index.mjs';

describe('EqualsRegExpCase', () => {
    const [guard, compare] = EqualsRegExpCase;

    // ----------------------- GUARD -----------------------

    test('guard: срабатывает только для пар RegExp', () => {
        expect(guard(/a/, /a/, {})).toBe(true);

        expect(guard(/a/, 'a' as unknown, {})).toBe(false);
        expect(guard('a' as unknown, /a/, {})).toBe(false);
        expect(guard({} as unknown, /a/, {})).toBe(false);
        expect(guard(/a/, {} as unknown, {})).toBe(false);
        expect(guard(123 as unknown, 456 as unknown, {})).toBe(false);
    });

    // ----------------------- COMPARE: базовые случаи -----------------------

    test('compare: одинаковый source и flags → true', () => {
        const r1 = /foo/gim;
        const r2 = new RegExp('foo', 'img'); // flags канонизируются в 'gim'
        expect(guard(r1, r2, {})).toBe(true);
        expect(compare(r1, r2, {})).toBe(true);
    });

    test('compare: разный source → false', () => {
        const r1 = /foo/g;
        const r2 = /fo+o/g;
        expect(guard(r1, r2, {})).toBe(true);
        expect(compare(r1, r2, {})).toBe(false);
    });

    test('compare: одинаковый source, разные flags → false', () => {
        const r1 = /foo/g;
        const r2 = /foo/i;
        expect(guard(r1, r2, {})).toBe(true);
        expect(compare(r1, r2, {})).toBe(false);
    });

    // ----------------------- COMPARE: канонизация флагов -----------------------

    test('compare: порядок флагов не важен (".flags" всегда упорядочены)', () => {
        const r1 = new RegExp('bar', 'gmi'); // вернёт r1.flags === 'gim'
        const r2 = new RegExp('bar', 'img'); // r2.flags === 'gim'
        expect(guard(r1, r2, {})).toBe(true);
        expect(r1.flags).toBe('gim');
        expect(r2.flags).toBe('gim');
        expect(compare(r1, r2, {})).toBe(true);
    });

    // ----------------------- COMPARE: специальные флаги -----------------------

    test('compare: чувствительность к набору флагов (u, y, s, d)', () => {
        const base = /baz/;
        const withU = /baz/u;
        const withY = /baz/y;
        const withS = /baz/s;
        // 'd' (indices) поддерживается средой Node >= 16/18 — проверим условно:
        // Если среда не поддерживает, RegExp('baz', 'd') бросит — тогда пропустим.
        let withD: RegExp | null = null;
        try {
            withD = new RegExp('baz', 'd');
        } catch {
            withD = null;
        }

        expect(guard(base, withU, {})).toBe(true);
        expect(compare(base, withU, {})).toBe(false);

        expect(guard(base, withY, {})).toBe(true);
        expect(compare(base, withY, {})).toBe(false);

        expect(guard(base, withS, {})).toBe(true);
        expect(compare(base, withS, {})).toBe(false);

        if (withD) {
            expect(guard(base, withD, {})).toBe(true);
            expect(compare(base, withD, {})).toBe(false);
        }
    });

    // ----------------------- COMPARE: lastIndex не влияет -----------------------

    test('compare: lastIndex игнорируется', () => {
        const r1 = /qux/g;
        const r2 = /qux/g;
        r1.lastIndex = 10;
        r2.lastIndex = 0;

        expect(guard(r1, r2, {})).toBe(true);
        expect(compare(r1, r2, {})).toBe(true);
    });

    // ----------------------- COMPARE: экранирование в source -------------------

    test('compare: экранирование влияет на source', () => {
        const r1 = /\./g; // source === '\\.'
        const r2 = new RegExp('.', 'g'); // source === '.'
        expect(guard(r1, r2, {})).toBe(true);
        expect(r1.source).toBe('\\.');
        expect(r2.source).toBe('.');
        expect(compare(r1, r2, {})).toBe(false);
    });

    // ----------------------- IMMUTABILITY -----------------------

    test('кортеж заморожен', () => {
        expect(Object.isFrozen(EqualsRegExpCase)).toBe(true);
    });
});
