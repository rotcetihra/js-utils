import { equals, type EqualsCase } from '@/index.mjs';
/**
 * Последовательность «кейсов» сравнения для функции {@link equals}.
 *
 * Пайплайн представляет собой неизменяемый массив из {@link EqualsCase},
 * каждый из которых состоит из guard-предиката и компаратора.
 *
 * Алгоритм работы:
 * 1. Значения `(a, b)` по очереди проверяются всеми guard-предикатами.
 * 2. Для первого совпавшего кейса вызывается его компаратор.
 * 3. Если компаратор вернёт `true`, значения считаются эквивалентными.
 *
 * Таким образом, пайплайн описывает стратегию сравнения в декларативной форме:
 * порядок элементов имеет значение.
 *
 * @example
 * ```ts
 * // Кейсы
 * const dateCase: EqualsCase = [
 *   (a, b) => a instanceof Date && b instanceof Date,
 *   (a, b) => (a as Date).getTime() === (b as Date).getTime(),
 * ];
 *
 * const arrayCase: EqualsCase = [
 *   (a, b) => Array.isArray(a) && Array.isArray(b),
 *   (a, b, options) =>
 *     (a as unknown[]).length === (b as unknown[]).length &&
 *     (a as unknown[]).every((v, i) => equals(v, (b as unknown[])[i], options)),
 * ];
 *
 * // Пайплайн
 * const pipeline: EqualsPipeline = [dateCase, arrayCase];
 *
 * // Использование
 * equals(new Date(1000), new Date(1000), { deep: true }); // true
 * equals([1, 2], [1, 2], { deep: true }); // true
 * ```
 */
type Pipeline = ReadonlyArray<EqualsCase>;

export type { Pipeline };
