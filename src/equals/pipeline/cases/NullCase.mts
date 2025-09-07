import {
    type EqualsCase,
    EqualsFastCase,
    equals,
    equalsCreateCase,
} from '@/index.mjs';

/**
 * Кейс для {@link equals}, обрабатывающий ситуацию,
 * когда одно из значений равно `null`, а другое — нет.
 *
 * Guard срабатывает, если хотя бы один из аргументов является `null`.
 * Если оба аргумента равны `null`, этот кейс не активируется,
 * так как такой случай уже покрывается быстрым кейсом {@link EqualsFastCase}
 * (через `Object.is(null, null)`).
 *
 * Компаратор всегда возвращает `false`, так как равенство `null`
 * с любым другим значением в JavaScript недопустимо.
 *
 * @example
 * ```ts
 * EqualsNullCase[0](null, 123, {}); // true — guard сработал
 * EqualsNullCase[1](null, 123, {}); // false — null не равно числу
 *
 * EqualsNullCase[0](null, null, {}); // false — guard не сработал,
 *                                    // этот случай обрабатывает EqualsFastCase
 * ```
 */
const NullCase: EqualsCase = equalsCreateCase(
    /* guard: */ (a: unknown, b: unknown) => a === null || b === null,

    /* compare: */ () => false,

    /* descriptor: */ {
        name: 'Null',
    },
);

export default NullCase;
