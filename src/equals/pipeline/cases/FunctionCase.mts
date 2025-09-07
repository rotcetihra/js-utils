import {
    type EqualsCase,
    EqualsFastCase,
    equals,
    equalsCreateCase,
} from '@/index.mjs';

/**
 * Кейс для {@link equals}, обрабатывающий функции.
 *
 * Guard срабатывает, если оба значения имеют тип `function`
 * (включая обычные, стрелочные, `async` и генераторы).
 *
 * Компаратор всегда возвращает `false`, так как структурное сравнение
 * поведения функций не определено и не воспроизводимо.
 *
 * Равенство по ссылке (`Object.is(fn1, fn2)`) обрабатывается ранее
 * в {@link EqualsFastCase}.
 *
 * @example
 * ```ts
 * const f1 = () => 1;
 * const f2 = () => 1;
 *
 * EqualsFunctionCase[0](f1, f2, {}); // true — guard: обе функции
 * EqualsFunctionCase[1](f1, f2, {}); // false — разные ссылки
 *
 * // В пайплайне:
 * // Object.is(f1, f1) === true → EqualsFastCase вернёт true.
 * ```
 */
const FunctionCase: EqualsCase = equalsCreateCase(
    /* guard: */ (a: unknown, b: unknown) =>
        typeof a === 'function' && typeof b === 'function',

    /* compare: */ () => false,

    /* descriptor: */ {
        name: 'Function',
    },
);

export default FunctionCase;
