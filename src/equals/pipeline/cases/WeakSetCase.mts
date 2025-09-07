import {
    type EqualsCase,
    EqualsFastCase,
    equals,
    equalsCreateCase,
} from '@/index.mjs';

/**
 * Кейс для {@link equals}, обрабатывающий объекты {@link WeakSet}.
 *
 * Guard срабатывает, если оба значения являются экземплярами `WeakSet`.
 *
 * Компаратор всегда возвращает `false`, так как содержимое `WeakSet`
 * недоступно для перебора и сравнения.
 *
 * Равенство по ссылке (`Object.is`) обрабатывается ранее в {@link EqualsFastCase}.
 *
 * @example
 * ```ts
 * const ws1 = new WeakSet();
 * const ws2 = new WeakSet();
 *
 * EqualsWeakSetCase[0](ws1, ws2, {}); // true — guard сработал
 * EqualsWeakSetCase[1](ws1, ws2, {}); // false — разные ссылки
 *
 * // В пайплайне:
 * // Object.is(ws1, ws1) === true → EqualsFastCase вернёт true.
 * ```
 */
const WeakSetCase: EqualsCase = equalsCreateCase(
    /* guard: */ (a: unknown, b: unknown) =>
        a instanceof WeakSet && b instanceof WeakSet,

    /* compare: */ () => false,

    /* descriptor: */ {
        name: 'WeakSet',
    },
);

export default WeakSetCase;
