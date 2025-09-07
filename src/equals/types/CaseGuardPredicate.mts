import {
    type EqualsOptions,
    type EqualsCase,
    type EqualsCaseComparePredicate,
} from '@/index.mjs';

/**
 * Функция-предикат (guard) для {@link EqualsCase}.
 *
 * Определяет, подходит ли пара значений `(a, b)` для данного кейса сравнения.
 * Если возвращает `true`, то именно этот кейс будет выбран и вызван его
 * {@link EqualsCaseComparePredicate компаратор}.
 *
 * Guard-функция обычно содержит проверки типов и структур
 * (например, `instanceof Date`, `Array.isArray`, проверку прототипа).
 * Она **не выполняет само сравнение значений**.
 *
 * @param a Первое значение для проверки.
 * @param b Второе значение для проверки.
 * @param options Опции сравнения (см. {@link EqualsOptions}).
 * @returns `true`, если кейс применим для данной пары значений;
 *          иначе `false`.
 *
 * @example
 * ```ts
 * // Guard для дат
 * const isBothDates: EqualsCaseGuardPredicate = (a, b) =>
 *   a instanceof Date && b instanceof Date;
 *
 * isBothDates(new Date(), new Date()); // true
 * isBothDates(new Date(), 42);         // false
 * ```
 */
type CaseGuardPredicate = (
    a: unknown,
    b: unknown,
    options: EqualsOptions,
) => boolean;

export type { CaseGuardPredicate };
