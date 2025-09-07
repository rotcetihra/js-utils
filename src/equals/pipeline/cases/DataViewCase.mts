import createCase from '@/equals/helpers/createCase.mjs';
import { type EqualsCase, equals } from '@/index.mjs';

/**
 * Кейс для {@link equals}, обрабатывающий объекты {@link DataView}.
 *
 * Guard срабатывает, если оба аргумента являются экземплярами `DataView`.
 *
 * Компаратор:
 * - сначала сравнивает `byteLength` и `byteOffset` двух представлений;
 * - затем извлекает подмассивы байтов (`Uint8Array`) на основе одного и того же окна
 *   в соответствующих буферах;
 * - побайтно сравнивает содержимое.
 *
 * Таким образом два разных объекта `DataView` считаются эквивалентными,
 * если они указывают на одинаковое содержимое (по длине, смещению и байтам),
 * даже если это разные экземпляры или разные базовые `ArrayBuffer`.
 *
 * @example
 * ```ts
 * const buf1 = new Uint8Array([1, 2, 3, 4]).buffer;
 * const buf2 = new Uint8Array([1, 2, 3, 4]).buffer;
 *
 * const dv1 = new DataView(buf1, 1, 2); // [2, 3]
 * const dv2 = new DataView(buf2, 1, 2); // [2, 3]
 *
 * EqualsDataViewCase[0](dv1, dv2, {}); // true  — guard сработал
 * EqualsDataViewCase[1](dv1, dv2, {}); // true  — байты совпали
 *
 * const dv3 = new DataView(buf2, 2, 2); // [3, 4]
 * EqualsDataViewCase[1](dv1, dv3, {}); // false — разные байты
 * ```
 */
const DataViewCase: EqualsCase = createCase(
    /* guard: */ (a: unknown, b: unknown) =>
        a instanceof DataView && b instanceof DataView,

    /* compare: */ (a: unknown, b: unknown) => {
        const da = a as DataView;
        const db = b as DataView;

        if (
            da.byteLength !== db.byteLength ||
            da.byteOffset !== db.byteOffset
        ) {
            return false;
        }

        const va = new Uint8Array(da.buffer, da.byteOffset, da.byteLength);
        const vb = new Uint8Array(db.buffer, db.byteOffset, db.byteLength);

        for (let i = 0; i < va.length; i++) {
            if (va[i] !== vb[i]) {
                return false;
            }
        }

        return true;
    },

    /* descriptor: */ {
        name: 'DataView',
    },
);

export default DataViewCase;
