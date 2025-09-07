import {
    EqualsFastCase,
    EqualsLooseCase,
    EqualsNullCase,
    EqualsBoxedCase,
    EqualsNotObjectCase,
    EqualsPrototypeCase,
    EqualsDateCase,
    EqualsRegExpCase,
    EqualsArrayBufferCase,
    EqualsDataViewCase,
    EqualsTypedArrayCase,
    EqualsArrayCase,
    EqualsSetCase,
    EqualsMapCase,
    EqualsWeakSetCase,
    EqualsWeakMapCase,
    EqualsFunctionCase,
    EqualsPromiseCase,
    EqualsErrorCase,
    EqualsURLCase,
    EqualsURLSearchParamsCase,
    EqualsPlainObjectCase,
    EqualsPipelineDefault,
    equals,
} from '@/index.mjs';

describe('EqualsPipelineDefault — состав и порядок', () => {
    test('пайплайн заморожен', () => {
        expect(Object.isFrozen(EqualsPipelineDefault)).toBe(true);
    });

    test('каждый элемент — замороженный кортеж из двух функций', () => {
        for (const c of EqualsPipelineDefault) {
            expect(Array.isArray(c)).toBe(true);
            expect(c).toHaveLength(2);
            expect(typeof c[0]).toBe('function');
            expect(typeof c[1]).toBe('function');
            expect(Object.isFrozen(c)).toBe(true);
        }
    });

    test('ключевые позиции и относительный порядок', () => {
        const p = EqualsPipelineDefault;

        // стартовые быстрые кейсы
        expect(p[0]).toBe(EqualsFastCase);
        expect(p[1]).toBe(EqualsLooseCase);
        expect(p[2]).toBe(EqualsNullCase);
        expect(p[3]).toBe(EqualsBoxedCase);
        expect(p[4]).toBe(EqualsNotObjectCase);
        expect(p[5]).toBe(EqualsPrototypeCase);

        // узкие типы присутствуют
        const idxDate = p.indexOf(EqualsDateCase);
        const idxRx = p.indexOf(EqualsRegExpCase);
        const idxAB = p.indexOf(EqualsArrayBufferCase);
        const idxDV = p.indexOf(EqualsDataViewCase);
        const idxTA = p.indexOf(EqualsTypedArrayCase);
        const idxArr = p.indexOf(EqualsArrayCase);
        const idxSet = p.indexOf(EqualsSetCase);
        const idxMap = p.indexOf(EqualsMapCase);

        for (const i of [
            idxDate,
            idxRx,
            idxAB,
            idxDV,
            idxTA,
            idxArr,
            idxSet,
            idxMap,
        ]) {
            expect(i).toBeGreaterThan(-1);
        }

        // блок "идентичность-только"
        const idxWS = p.indexOf(EqualsWeakSetCase);
        const idxWM = p.indexOf(EqualsWeakMapCase);
        const idxFn = p.indexOf(EqualsFunctionCase);
        const idxPr = p.indexOf(EqualsPromiseCase);
        expect(idxWS).toBeGreaterThan(-1);
        expect(idxWM).toBeGreaterThan(-1);
        expect(idxFn).toBeGreaterThan(-1);
        expect(idxPr).toBeGreaterThan(-1);

        // URL/URLSearchParams стоят перед PlainObject
        const idxURL = p.indexOf(EqualsURLCase);
        const idxUSP = p.indexOf(EqualsURLSearchParamsCase);
        const idxPO = p.indexOf(EqualsPlainObjectCase);
        expect(idxURL).toBeGreaterThan(-1);
        expect(idxUSP).toBeGreaterThan(-1);
        expect(idxPO).toBeGreaterThan(-1);
        expect(idxURL).toBeLessThan(idxPO);
        expect(idxUSP).toBeLessThan(idxPO);

        // последний — PlainObject
        expect(p[p.length - 1]).toBe(EqualsPlainObjectCase);

        // Error присутствует
        expect(p.indexOf(EqualsErrorCase)).toBeGreaterThan(-1);
    });
});

describe('EqualsPipelineDefault — семантика (smoke)', () => {
    // -------- Fast & Loose --------
    test('Fast: NaN ~ NaN; Loose: "1" == 1', () => {
        expect(equals(NaN, NaN, {})).toBe(true);
        expect(equals('1', 1, { loose: true })).toBe(true);
        expect(equals('1', 1, { loose: false })).toBe(false);
    });

    // -------- Boxed / NotObject / Prototype --------
    test('Boxed примитивы по valueOf(); NotObject и разные прототипы отсекаются', () => {
        expect(equals(new Number(3), new Number(3), {})).toBe(true);
        expect(equals(new String('a'), new String('a'), {})).toBe(true);
        expect(equals(1, {}, {})).toBe(false);
        expect(equals(Object.create(null), {}, {})).toBe(false);
    });

    // -------- Date / RegExp --------
    test('Date и RegExp', () => {
        expect(equals(new Date(1000), new Date(1000), {})).toBe(true);
        expect(equals(/foo/im, new RegExp('foo', 'mi'), {})).toBe(true);
        expect(equals(/foo/g, /foo/i, {})).toBe(false);
    });

    // -------- ArrayBuffer / DataView --------
    test('ArrayBuffer / DataView', () => {
        const ab1 = new Uint8Array([1, 2, 3]).buffer;
        const ab2 = new Uint8Array([1, 2, 3]).buffer;
        const ab3 = new Uint8Array([1, 2, 4]).buffer;
        expect(equals(ab1, ab2, {})).toBe(true);
        expect(equals(ab1, ab3, {})).toBe(false);

        const dv1 = new DataView(ab1, 0, 3);
        const dv2 = new DataView(ab2, 0, 3);
        const dv3 = new DataView(ab2, 1, 2);
        expect(equals(dv1, dv2, {})).toBe(true);
        expect(equals(dv1, dv3, {})).toBe(false);
    });

    // -------- TypedArray --------
    test('TypedArray: NaN ~ NaN; ±0 зависят от loose', () => {
        const a = new Float64Array([1, Number.NaN, +0]);
        const b = new Float64Array([1, Number.NaN, -0]);
        expect(equals(a, b, {})).toBe(false); // различаем +0/-0
        expect(equals(a, b, { loose: true })).toBe(true); // допускаем +0 == -0
    });

    // -------- Array --------
    test('Array: длина/дырки; deep управляет рекурсией', () => {
        expect(equals([1, , 3], [1, undefined, 3], {})).toBe(false);
        expect(equals([[1, 2]], [[1, 2]], { deep: false })).toBe(false);
        expect(equals([[1, 2]], [[1, 2]], { deep: true, depth: 5 })).toBe(true);
    });

    // -------- Set / Map --------
    test('Set/Map: fast (SameValueZero) и deep-биекция', () => {
        // Set fast
        expect(equals(new Set([1, 2, 3]), new Set([3, 2, 1]), {})).toBe(true);
        expect(equals(new Set([+0]), new Set([-0]), {})).toBe(true); // SameValueZero
        // Set deep
        const sa = new Set([{ v: '1' }]);
        const sb = new Set([{ v: 1 }]);
        expect(equals(sa, sb, { deep: true, depth: 5, loose: true })).toBe(
            true,
        );

        // Map deep (plain-object ключи/значения)
        const ma = new Map([
            [{ id: 1 }, { v: 10 }],
            [{ id: 2 }, { v: 20 }],
        ]);
        const mb = new Map([
            [{ id: 2 }, { v: 20 }],
            [{ id: 1 }, { v: 10 }],
        ]);
        expect(equals(ma, mb, { deep: true, depth: 5 })).toBe(true);
    });

    // -------- WeakSet / WeakMap / Function / Promise --------
    test('Weak*/Function/Promise равны только по ссылке', () => {
        const ws1 = new WeakSet(),
            ws2 = new WeakSet();
        const wm1 = new WeakMap(),
            wm2 = new WeakMap();
        const f1 = () => {},
            f2 = () => {};
        const p1 = Promise.resolve(1),
            p2 = Promise.resolve(1);

        expect(equals(ws1, ws2, {})).toBe(false);
        expect(equals(wm1, wm2, {})).toBe(false);
        expect(equals(f1, f2, {})).toBe(false);
        expect(equals(p1, p2, {})).toBe(false);

        // одинаковая ссылка ловится FastCase:
        expect(equals(ws1, ws1, {})).toBe(true);
        expect(equals(f1, f1, {})).toBe(true);
    });

    // -------- Error --------
    test('Error: name/message и cause по deep/loose', () => {
        const e1: any = new Error('boom');
        e1.cause = { code: 1 };
        const e2: any = new Error('boom');
        e2.cause = { code: 1 };
        expect(equals(e1, e2, { deep: true, depth: 5 })).toBe(true);

        const e3 = new TypeError('x');
        const e4 = new RangeError('x');
        expect(equals(e3, e4, {})).toBe(false);

        const e5: any = new Error('e');
        e5.cause = '1';
        const e6: any = new Error('e');
        e6.cause = 1;
        expect(equals(e5, e6, { deep: false, loose: false })).toBe(false);
        expect(equals(e5, e6, { deep: false, loose: true })).toBe(true);
    });

    // -------- URL / URLSearchParams --------
    test('URL: сравнение по href; URLSearchParams: мультимножество пар', () => {
        const u1 = new URL('https://example.com:443/a?x=1#h');
        const u2 = new URL('https://EXAMPLE.com/a?x=1#h');
        expect(equals(u1, u2, {})).toBe(true);

        const q1 = new URLSearchParams('a=1&b=2&b=3');
        const q2 = new URLSearchParams('b=3&a=1&b=2');
        const q3 = new URLSearchParams('a=1&b=2'); // меньше повторов
        expect(equals(q1, q2, {})).toBe(true);
        expect(equals(q1, q3, {})).toBe(false);
    });

    // -------- PlainObject --------
    test('PlainObject: ключи/значения, deep/loose/depth', () => {
        const a = { x: 1, y: { z: '3' } };
        const b = { y: { z: 3 }, x: 1 };
        expect(equals(a, b, { deep: true, depth: 10, loose: true })).toBe(true);

        // различие в наборе ключей
        expect(equals({ x: 1 }, { y: 1 }, {})).toBe(false);
    });
});
