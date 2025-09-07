import { type EqualsCase, equals, equalsCreateCase } from '@/index.mjs';

/**
 * Быстрый кейс для {@link equals}, срабатывающий,
 * если два значения идентичны по алгоритму `Object.is`.
 *
 * Особенности `Object.is`:
 * - `Object.is(NaN, NaN) === true` (в отличие от `===`).
 * - `Object.is(+0, -0) === false` (в отличие от `===`).
 * - Для всех остальных примитивов и объектов работает как строгое равенство.
 *
 * Компаратор всегда возвращает `true`, так как факт идентичности
 * уже гарантирован guard-предикатом.
 *
 * Этот кейс размещается в начале пайплайна как быстрый путь:
 * он сразу отсекает большинство простых ситуаций и ускоряет сравнение.
 *
 * @example
 * ```ts
 * EqualsFastCase[0](NaN, NaN, {});    // true — guard сработал
 * EqualsFastCase[1](NaN, NaN, {});    // true — значения идентичны
 *
 * EqualsFastCase[0](+0, -0, {});      // false — guard не сработал
 * ```
 */
const FastCase: EqualsCase = equalsCreateCase(
    /* guard: */ (a: unknown, b: unknown) => Object.is(a, b),

    /* compare: */ () => true,

    /* descriptor: */ {
        name: 'Fast',
    },
);

export default FastCase;
