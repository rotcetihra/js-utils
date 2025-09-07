import { type EqualsCase, equals, equalsCreateCase } from '@/index.mjs';

/**
 * Кейс для {@link equals}, обрабатывающий объекты {@link ArrayBuffer}.
 *
 * Guard срабатывает, если оба аргумента являются экземплярами `ArrayBuffer`.
 *
 * Компаратор:
 * - сначала проверяет длину буферов (`byteLength`);
 * - затем побайтно сравнивает содержимое через `Uint8Array`.
 *
 * Таким образом два разных объекта `ArrayBuffer` считаются эквивалентными,
 * если они имеют одинаковую длину и одинаковое содержимое по байтам.
 *
 * @example
 * ```ts
 * const buf1 = new Uint8Array([1, 2, 3]).buffer;
 * const buf2 = new Uint8Array([1, 2, 3]).buffer;
 * const buf3 = new Uint8Array([1, 2, 4]).buffer;
 *
 * EqualsArrayBufferCase[0](buf1, buf2, {}); // true — guard сработал
 * EqualsArrayBufferCase[1](buf1, buf2, {}); // true — байты совпали
 *
 * EqualsArrayBufferCase[0](buf1, buf3, {}); // true — guard сработал
 * EqualsArrayBufferCase[1](buf1, buf3, {}); // false — разные байты
 * ```
 */
const ArrayBufferCase: EqualsCase = equalsCreateCase(
    /* guard: */ (a: unknown, b: unknown) =>
        a instanceof ArrayBuffer && b instanceof ArrayBuffer,

    /* compare: */ (a: unknown, b: unknown) => {
        const ba = a as ArrayBuffer;
        const bb = b as ArrayBuffer;

        if (ba.byteLength !== bb.byteLength) {
            return false;
        }

        const va = new Uint8Array(ba);
        const vb = new Uint8Array(bb);

        for (let i = 0; i < va.length; i++) {
            if (va[i] !== vb[i]) {
                return false;
            }
        }

        return true;
    },

    /* descriptor: */ {
        name: 'ArrayBuffer',
    },
);

export default ArrayBufferCase;
