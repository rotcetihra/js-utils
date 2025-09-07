import {
    type EqualsCase,
    type EqualsOptions,
    EqualsFastCase,
    equals,
    equalsCreateCase,
    equalsParseOptions,
} from '@/index.mjs';

/**
 * Кейс для {@link equals}, реализующий «слабое» сравнение значений
 * с помощью оператора `==`, если включена опция {@link EqualsOptions.loose | loose}.
 *
 * Guard срабатывает, если:
 * - установлен флаг `loose: true` в опциях;
 * - оба значения не являются `symbol` (так как `==` с `symbol`
 *   может выбросить {@link TypeError});
 * - выражение `a == b` возвращает `true`.
 *
 * Компаратор всегда возвращает `true`, так как сам факт эквивалентности
 * уже проверен guard-функцией.
 *
 * Этот кейс обычно следует сразу после {@link EqualsFastCase} и
 * позволяет при необходимости включить «поблажки» в сравнении примитивов:
 * - `1 == '1'` → `true`
 * - `true == 1` → `true`
 * - `null == undefined` → `true`
 * - `0 == ''` → `true`
 *
 * @example
 * ```ts
 * // Guard не сработает, если loose = false
 * EqualsLooseCase[0](1, '1', { loose: false }); // false
 *
 * // Guard срабатывает при loose = true
 * EqualsLooseCase[0](1, '1', { loose: true });  // true
 * EqualsLooseCase[1](1, '1', { loose: true });  // true
 *
 * // null и undefined эквивалентны по ==
 * EqualsLooseCase[0](null, undefined, { loose: true }); // true
 *
 * // Symbol безопасно отсекается
 * EqualsLooseCase[0](Symbol('x'), 'x', { loose: true }); // false (без ошибки)
 * ```
 */
const LooseCase: EqualsCase = equalsCreateCase(
    /* guard: */ (a: unknown, b: unknown, o: EqualsOptions) =>
        !!o.loose && typeof a !== 'symbol' && typeof b !== 'symbol' && a == b,

    /* compare: */ () => true,

    /* descriptor: */ {
        name: 'Loose',
        options: {
            loose: false,
        },
        parseOptions: equalsParseOptions,
    },
);

export default LooseCase;
