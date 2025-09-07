import {
    equalsPrimitive,
    isBoxedBoolean,
    isBoxedNumber,
    isBoxedString,
    equals,
    type EqualsCase,
    type EqualsOptions,
    equalsCreateCase,
    equalsParseOptions,
} from '@/index.mjs';

/**
 * Кейс для {@link equals}, обрабатывающий **боксированные примитивы**:
 * - строки (`new String("...")`)
 * - числа (`new Number(42)`)
 * - булевы (`new Boolean(true/false)`)
 *
 * Guard срабатывает, если оба значения одновременно являются
 * объектами-обёртками одного и того же примитивного типа
 * (строка, число или булево).
 *
 * Компаратор разворачивает значения в их примитивную форму
 * (`.valueOf()`) и сравнивает их с помощью {@link equalsPrimitive},
 * учитывая флаг {@link EqualsOptions.loose | loose}.
 *
 * Таким образом, `new String("abc")` и `new String("abc")`
 * считаются эквивалентными, а `new Number(1)` и `new Number("1")`
 * могут быть равны только если включён `loose`.
 *
 * @example
 * ```ts
 * // Боксированные строки
 * EqualsBoxedCase[0](new String("hi"), new String("hi"), {}); // true — guard сработал
 * EqualsBoxedCase[1](new String("hi"), new String("hi"), {}); // true — примитивы совпали
 *
 * // Боксированные числа
 * EqualsBoxedCase[0](new Number(1), new Number(1), {}); // true
 * EqualsBoxedCase[1](new Number(1), new Number(1), {}); // true
 *
 * // Loose-режим: число и строка
 * EqualsBoxedCase[0](new Number(1), new Number("1" as any), { loose: true }); // true
 *
 * // Разные типы боксов
 * EqualsBoxedCase[0](new Number(1), new String("1"), {}); // false — guard не сработал
 * ```
 */
const BoxedCase: EqualsCase = equalsCreateCase(
    /* guard: */ (a: unknown, b: unknown) =>
        (isBoxedString(a) && isBoxedString(b)) ||
        (isBoxedNumber(a) && isBoxedNumber(b)) ||
        (isBoxedBoolean(a) && isBoxedBoolean(b)),

    /* compare: */ (a: unknown, b: unknown, o: EqualsOptions) =>
        equalsPrimitive(
            (a as String | Number | Boolean).valueOf(),
            (b as String | Number | Boolean).valueOf(),
            o.loose,
        ),

    /* descriptor: */ {
        name: 'Boxed',
        options: {
            loose: false,
        },
        parseOptions: equalsParseOptions,
    },
);

export default BoxedCase;
