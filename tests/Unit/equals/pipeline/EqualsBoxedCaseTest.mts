import { EqualsBoxedCase } from '@/index.mjs';

describe('EqualsBoxedCase', () => {
    const [guard, compare] = EqualsBoxedCase;

    // ----------------------- GUARD -----------------------

    test('guard: срабатывает для пар одного типа боксов (String/Number/Boolean)', () => {
        expect(guard(new String('hi'), new String('hi'), {})).toBe(true);
        expect(guard(new Number(1), new Number(2), {})).toBe(true);
        expect(guard(new Boolean(true), new Boolean(false), {})).toBe(true);
    });

    test('guard: не срабатывает для смешанных типов боксов', () => {
        expect(guard(new String('1'), new Number(1), {})).toBe(false);
        expect(guard(new Boolean(true), new String('true'), {})).toBe(false);
        expect(guard(new Number(1), new Boolean(true), {})).toBe(false);
    });

    test('guard: не срабатывает, если хотя бы одно значение не бокс', () => {
        expect(guard('hi', new String('hi'), {})).toBe(false);
        expect(guard(new Number(1), 1, {})).toBe(false);
        expect(guard(true, new Boolean(true), {})).toBe(false);
        expect(guard({}, new String('x'), {})).toBe(false);
        expect(guard([], new Number(1), {})).toBe(false);
        expect(guard(undefined, new Boolean(false), {})).toBe(false);
        expect(guard(null, new String(''), {})).toBe(false);
    });

    // ---------------------- COMPARE ----------------------

    test('compare: боксированные строки равны по примитивным значениям', () => {
        const a = new String('alpha');
        const b = new String('alpha');
        expect(guard(a, b, {})).toBe(true);
        expect(compare(a, b, {})).toBe(true);

        const c = new String('beta');
        expect(guard(a, c, {})).toBe(true);
        expect(compare(a, c, {})).toBe(false);
    });

    test('compare: боксированные булевы равны/не равны по valueOf()', () => {
        const t1 = new Boolean(true);
        const t2 = new Boolean(true);
        const f1 = new Boolean(false);

        expect(guard(t1, t2, {})).toBe(true);
        expect(compare(t1, t2, {})).toBe(true);

        expect(guard(t1, f1, {})).toBe(true);
        expect(compare(t1, f1, {})).toBe(false);
    });

    test('compare: боксированные числа учитывают NaN и +0/-0 согласно equalsPrimitive', () => {
        // NaN: Object.is(NaN, NaN) === true → equalsPrimitive strict → true
        const n1 = new Number(NaN);
        const n2 = new Number(NaN);
        expect(guard(n1, n2, {})).toBe(true);
        expect(compare(n1, n2, {})).toBe(true);

        // +0/-0: Object.is(+0, -0) === false → strict → false
        const p0 = new Number(+0);
        const n0 = new Number(-0);
        expect(guard(p0, n0, {})).toBe(true);
        expect(compare(p0, n0, {})).toBe(false);

        // В loose-режиме +0 == -0 → true
        expect(compare(p0, n0, { loose: true })).toBe(true);
    });

    test('compare: боксированные числа уважает loose для строковых значений внутри бокса', () => {
        // Имитация необычного кейса: через any кладём строку внутрь Number-бокса.
        // В рантайме valueOf() вернёт примитив, и equalsPrimitive решит исход.
        const a = new Number(1);
        const b = new Number(0) as any;
        b.valueOf = () => '1'; // кастомный valueOf, вернёт строку

        expect(guard(a, b, {})).toBe(true);
        expect(compare(a, b, {})).toBe(false); // strict: 1 !== '1'
        expect(compare(a, b, { loose: true })).toBe(true); // loose: 1 == '1'
    });

    // ---------------------- NEGATIVE ----------------------

    test('compare: не вызывается (по контракту) когда guard=false — но если вызвать вручную, возвращает корректный результат только для боксов', () => {
        // Смешанные типы — guard false. Вызов compare руками допустим в тесте,
        // он приведёт a/b к (String|Number|Boolean). Здесь проверим на «безопасное» поведение:
        const res1 = compare('x' as unknown, new String('x') as unknown, {});
        const res2 = compare(1 as unknown, new Number(1) as unknown, {});
        const res3 = compare(true as unknown, new Boolean(true) as unknown, {});

        // Поскольку compare кастит к боксу и зовёт .valueOf(), строки/числа/булевы как примитивы
        // тоже имеют valueOf(), так что поведение будет как у equalsPrimitive.
        expect(res1).toBe(true); // 'x'.valueOf() === 'x'
        expect(res2).toBe(true); // 1.valueOf() === 1
        expect(res3).toBe(true); // true.valueOf() === true
    });

    // ---------------------- IMMUTABILITY ----------------------

    test('readonly: кортеж заморожен', () => {
        expect(Object.isFrozen(EqualsBoxedCase)).toBe(true);
    });
});
