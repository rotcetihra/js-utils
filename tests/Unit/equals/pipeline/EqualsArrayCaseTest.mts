import { EqualsArrayCase } from '@/index.mjs';

describe('EqualsArrayCase', () => {
    const [guard, compare] = EqualsArrayCase;

    // ----------------------- GUARD -----------------------

    test('guard: true только для пар Array', () => {
        expect(guard([], [], {})).toBe(true);
        expect(guard([1], [2], {})).toBe(true);

        expect(guard([], {} as unknown, {})).toBe(false);
        expect(guard({} as unknown, [], {})).toBe(false);
        expect(guard(123 as unknown, [] as unknown, {})).toBe(false);
    });

    // ----------------------- COMPARE: базовые -----------------------

    test('одинаковое содержимое → true', () => {
        const a = [1, 2, 3];
        const b = [1, 2, 3];
        expect(compare(a, b, {})).toBe(true);
    });

    test('разная длина → false', () => {
        expect(compare([1, 2], [1, 2, 3], {})).toBe(false);
    });

    test('различие в одном элементе → false', () => {
        expect(compare([1, 2, 3], [1, 2, 4], {})).toBe(false);
    });

    // ----------------------- COMPARE: дырки -----------------------

    test('дырка vs undefined → false', () => {
        const a = [1, , 3]; // «дырка» на индексе 1
        const b = [1, undefined, 3]; // явный undefined
        expect(compare(a, b, {})).toBe(false);
    });

    test('совпадающие дырки → true', () => {
        const a = [1, , 3];
        const b = [1, , 3];
        expect(compare(a, b, {})).toBe(true);
    });

    // ----------------------- COMPARE: deep -----------------------

    test('deep=false: вложенные массивы сравниваются по ссылке', () => {
        const a = [[1, 2]];
        const b = [[1, 2]];
        expect(compare(a, b, { deep: false })).toBe(false); // разные ссылки
    });

    test('deep=true: вложенные массивы сравниваются рекурсивно', () => {
        const a = [[1, 2]];
        const b = [[1, 2]];
        expect(compare(a, b, { deep: true, depth: 5 })).toBe(true);
    });

    test('depth=0: вложенные массивы не сравниваются рекурсивно', () => {
        const a = [[1, 2]];
        const b = [[1, 2]];
        expect(compare(a, b, { deep: true, depth: 0 })).toBe(false);
    });

    // ----------------------- COMPARE: loose -----------------------

    test('loose=true: "1" и 1 считаются равными', () => {
        const a = ['1'];
        const b = [1];
        expect(compare(a, b, { loose: true })).toBe(true);
    });

    test('loose=false: "1" и 1 считаются разными', () => {
        const a = ['1'];
        const b = [1];
        expect(compare(a, b, { loose: false })).toBe(false);
    });

    // ----------------------- IMMUTABILITY -----------------------

    test('кортеж заморожен', () => {
        expect(Object.isFrozen(EqualsArrayCase)).toBe(true);
    });
});
