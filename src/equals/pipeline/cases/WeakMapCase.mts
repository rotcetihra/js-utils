import {
    type EqualsCase,
    EqualsFastCase,
    equals,
    equalsCreateCase,
} from '@/index.mjs';

/**
 * Кейс для {@link equals}, обрабатывающий объекты {@link WeakMap}.
 *
 * Guard срабатывает, если оба значения являются экземплярами `WeakMap`.
 *
 * Компаратор всегда возвращает `false`, так как содержимое `WeakMap`
 * недоступно для перебора и сравнения.
 *
 * Равенство по ссылке (`Object.is`) обрабатывается ранее в {@link EqualsFastCase}.
 *
 * @example
 * ```ts
 * const wm1 = new WeakMap();
 * const wm2 = new WeakMap();
 *
 * EqualsWeakMapCase[0](wm1, wm2, {}); // true — guard сработал
 * EqualsWeakMapCase[1](wm1, wm2, {}); // false — разные ссылки
 *
 * // В пайплайне:
 * // Object.is(wm1, wm1) === true → EqualsFastCase вернёт true.
 * ```
 */
const WeakMapCase: EqualsCase = equalsCreateCase(
    /* guard: */ (a: unknown, b: unknown) =>
        a instanceof WeakMap && b instanceof WeakMap,

    /* compare: */ () => false,

    /* descriptor: */ {
        name: 'WeakMap',
    },
);

export default WeakMapCase;
