import {
    equals,
    equalsCreateCase,
    equalsParseOptions,
    equalsPrimitive,
    type EqualsCase,
    type EqualsOptions,
} from '@/index.mjs';

/**
 * Кейс для {@link equals}, обрабатывающий все типы {@link TypedArray},
 * включая BigInt-варианты:
 *
 * - Int8Array, Uint8Array, Uint8ClampedArray
 * - Int16Array, Uint16Array
 * - Int32Array, Uint32Array
 * - Float32Array, Float64Array
 * - BigInt64Array, BigUint64Array
 *
 * Guard срабатывает, если оба значения — представления на ArrayBuffer
 * (`ArrayBuffer.isView(a/b) === true`) **и** не являются `DataView`.
 *
 * Компаратор:
 * 1) проверяет совпадение конструкторов (один и тот же тип TypedArray);
 * 2) сравнивает длину (`length`);
 * 3) поэлементно сравнивает:
 *    - по умолчанию через `Object.is` (через {@link equalsPrimitive}),
 *      что делает `NaN ~ NaN` равными и различает `+0` и `-0`;
 *    - при `options.loose === true` — через оператор `==`,
 *      что, например, приравняет `+0` и `-0`.
 *
 * Замечания:
 * - Для BigInt-массивов элементы — `bigint`. `equalsPrimitive` корректно
 *   сравнивает `bigint`/`bigint` в строгом режиме, а при `loose` — `==`.
 * - TypedArray-элементы имеют фиксированные типы, так что «неожиданная» коэрция
 *   встречается только при `loose`.
 *
 * @example
 * ```ts
 * const a = new Float64Array([1, NaN, 0]);
 * const b = new Float64Array([1, NaN, -0]);
 *
 * // strict: NaN ~ NaN эквивалентны; +0 !== -0
 * EqualsTypedArrayCase[0](a, b, {}); // true
 * EqualsTypedArrayCase[1](a, b, {}); // false (из-за +0/-0)
 *
 * // loose: +0 == -0 → true
 * EqualsTypedArrayCase[1](a, b, { loose: true }); // true
 * ```
 */
const TypedArrayCase: EqualsCase = equalsCreateCase(
    /* guard: */ (a: unknown, b: unknown) =>
        ArrayBuffer.isView(a) &&
        ArrayBuffer.isView(b) &&
        !(a instanceof DataView) &&
        !(b instanceof DataView),

    /* compare: */ (a: unknown, b: unknown, o: EqualsOptions) => {
        const ta = a as ArrayLike<number | bigint> & {
            constructor: Function;
            length: number;
        };
        const tb = b as ArrayLike<number | bigint> & {
            constructor: Function;
            length: number;
        };

        if (ta.constructor !== tb.constructor) {
            return false;
        }

        if (ta.length !== tb.length) {
            return false;
        }

        const loose = !!o.loose;

        for (let i = 0; i < ta.length; i++) {
            const va = ta[i] as number | bigint;
            const vb = tb[i] as number | bigint;

            // 1) Быстрое полное совпадение (включая NaN ~ NaN, различие +0/-0)
            if (Object.is(va, vb)) {
                continue;
            }

            // 2) Если нужен "loose", разрешаем == (даст +0 == -0 → true)
            if (loose) {
                if ((va as any) == (vb as any)) {
                    continue;
                }
            }

            // 3) Иначе — не равны
            return false;
        }

        return true;
    },

    /* descriptor: */ {
        name: 'TypedArray',
        options: {
            loose: false,
        },
        parseOptions: equalsParseOptions,
    },
);

export default TypedArrayCase;
