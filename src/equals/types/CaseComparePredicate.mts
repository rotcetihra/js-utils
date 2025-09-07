import {
    type EqualsOptions,
    type EqualsCase,
    type EqualsCaseGuardPredicate,
} from '@/index.mjs';

/**
 * Функция-компаратор для {@link EqualsCase}.
 *
 * Получает два значения и набор опций сравнения, и должна вернуть `true`,
 * если значения эквивалентны, либо `false` в противном случае.
 *
 * В отличие от {@link EqualsCaseGuardPredicate guard-предиката},
 * который лишь определяет, подходит ли пара значений под данный кейс,
 * компаратор реализует саму логику сравнения.
 *
 * @param a Первое сравниваемое значение.
 * @param b Второе сравниваемое значение.
 * @param options Опции, задающие стратегию сравнения
 *                (см. {@link EqualsOptions}).
 * @returns `true`, если значения равны по правилам данного кейса;
 *          иначе `false`.
 *
 * @example
 * ```ts
 * // Компаратор для дат: равенство по таймштампу
 * const compareDates: EqualsCaseComparePredicate = (a, b) =>
 *   (a as Date).getTime() === (b as Date).getTime();
 *
 * compareDates(new Date(1000), new Date(1000), {}); // true
 * compareDates(new Date(1000), new Date(2000), {}); // false
 * ```
 */
type CaseComparePredicate = (
    a: unknown,
    b: unknown,
    options: EqualsOptions,
) => boolean;

export type { CaseComparePredicate };
