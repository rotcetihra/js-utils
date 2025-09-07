import {
    type EqualsCase,
    EqualsFastCase,
    equals,
    equalsCreateCase,
} from '@/index.mjs';

/**
 * Кейс для {@link equals}, обрабатывающий объекты {@link Promise}.
 *
 * Guard срабатывает, если оба значения являются экземплярами `Promise`.
 *
 * Компаратор всегда возвращает `false`, так как сравнение состояний/результатов
 * промисов недетерминировано и некорректно в общем случае.
 *
 * Равенство по ссылке (`Object.is`) обрабатывается ранее в {@link EqualsFastCase}.
 *
 * @example
 * ```ts
 * const a = Promise.resolve(1);
 * const b = Promise.resolve(1);
 *
 * EqualsPromiseCase[0](a, b, {}); // true — guard: оба Promise
 * EqualsPromiseCase[1](a, b, {}); // false — разные экземпляры
 *
 * // В пайплайне:
 * // Object.is(a, a) === true → EqualsFastCase вернёт true.
 * ```
 */
const PromiseCase: EqualsCase = equalsCreateCase(
    /* guard: */ (a: unknown, b: unknown) =>
        a instanceof Promise && b instanceof Promise,

    /* compare: */ () => false,

    /* descriptor: */ {
        name: 'Promise',
    },
);

export default PromiseCase;
