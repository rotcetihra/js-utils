import {
    type EqualsCaseGuardPredicate,
    type EqualsCaseComparePredicate,
    type EqualsPipeline,
    equals,
    type EqualsCaseDescriptor,
} from '@/index.mjs';

/**
 * Одна «ступень» пайплайна сравнения для {@link equals}.
 *
 * Представляет собой неизменяемый кортеж из двух функций:
 *
 * 1. {@link EqualsCaseGuardPredicate Guard-предикат} —
 *    определяет, применим ли данный случай к паре значений `(a, b)`.
 *    Если возвращает `true`, значит именно этот кейс берёт на себя сравнение.
 *
 * 2. {@link EqualsCaseComparePredicate Компаратор} —
 *    выполняет собственно сравнение значений `(a, b)` по заданным опциям.
 *
 * Кейс используется внутри пайплайна {@link EqualsPipeline}: перебирается
 * последовательность таких пар, и первый сработавший guard вызывает
 * связанный компаратор.
 *
 * @example
 * ```ts
 * // Кейс для сравнения дат
 * const dateCase: EqualsCase = [
 *   (a, b) => a instanceof Date && b instanceof Date,   // guard
 *   (a, b) => (a as Date).getTime() === (b as Date).getTime() // compare
 * ];
 *
 * // Подключение в пайплайн
 * const pipeline: EqualsPipeline = [dateCase];
 * ```
 */
interface Case {
    guard: EqualsCaseGuardPredicate;
    compare: EqualsCaseComparePredicate;
    descriptor?: EqualsCaseDescriptor;
}

export type { Case };
