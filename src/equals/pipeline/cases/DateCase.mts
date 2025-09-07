import createCase from '@/equals/helpers/createCase.mjs';
import { type EqualsCase, equals } from '@/index.mjs';

/**
 * Кейс для {@link equals}, обрабатывающий объекты {@link Date}.
 *
 * Guard срабатывает, если оба аргумента являются экземплярами `Date`.
 *
 * Компаратор извлекает их числовые значения (`.getTime()`) и
 * сравнивает их через {@link Object.is}. Это позволяет:
 *
 * - правильно считать два разных объекта `Date` равными,
 *   если они указывают на один и тот же момент времени;
 * - корректно обрабатывать `Invalid Date`: `getTime()` возвращает `NaN`,
 *   и `Object.is(NaN, NaN)` даёт `true`, так что два невалидных объекта
 *   `Date` тоже считаются эквивалентными.
 *
 * @example
 * ```ts
 * const d1 = new Date(1000);
 * const d2 = new Date(1000);
 * const d3 = new Date(2000);
 * const bad1 = new Date(NaN);
 * const bad2 = new Date(NaN);
 *
 * EqualsDateCase[0](d1, d2, {}); // true  — guard сработал
 * EqualsDateCase[1](d1, d2, {}); // true  — одинаковый timestamp
 *
 * EqualsDateCase[0](d1, d3, {}); // true  — guard сработал
 * EqualsDateCase[1](d1, d3, {}); // false — разные timestamp
 *
 * EqualsDateCase[0](bad1, bad2, {}); // true  — guard сработал
 * EqualsDateCase[1](bad1, bad2, {}); // true  — оба Invalid Date
 * ```
 */
const DateCase: EqualsCase = createCase(
    /* guard: */ (a: unknown, b: unknown) =>
        a instanceof Date && b instanceof Date,

    /* compare: */ (a: unknown, b: unknown) =>
        Object.is((a as Date).getTime(), (b as Date).getTime()),

    /* descriptor: */ {
        name: 'Date',
    },
);

export default DateCase;
