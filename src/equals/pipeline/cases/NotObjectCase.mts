import {
    type EqualsCase,
    EqualsFastCase,
    EqualsLooseCase,
    EqualsNullCase,
    EqualsBoxedCase,
    equals,
    equalsCreateCase,
} from '@/index.mjs';

/**
 * Кейс для {@link equals}, отсекающий все значения,
 * которые не являются объектами.
 *
 * Guard срабатывает, если хотя бы один из аргументов
 * имеет `typeof` не равный `"object"`.
 *
 * Этот кейс должен размещаться **в самом конце пайплайна**,
 * так как до него уже проверяются:
 *
 * - быстрые совпадения через {@link EqualsFastCase},
 * - loose-сравнение через {@link EqualsLooseCase},
 * - null-специальный случай через {@link EqualsNullCase},
 * - боксы (`new String`, `new Number`, `new Boolean`) через {@link EqualsBoxedCase},
 * - и другие специфические структуры (Date, RegExp, массивы, Map, Set и т.п.).
 *
 * Таким образом, если доходит до этого кейса и одно из значений — не объект,
 * значит сравнение заведомо должно вернуть `false`.
 *
 * @example
 * ```ts
 * EqualsNotObjectCase[0](42, { x: 1 }, {});  // true — guard сработал
 * EqualsNotObjectCase[1](42, { x: 1 }, {});  // false
 *
 * EqualsNotObjectCase[0]('a', 'b', {});      // true
 * EqualsNotObjectCase[1]('a', 'b', {});      // false
 *
 * // Если оба значения объекты, guard не срабатывает
 * EqualsNotObjectCase[0]({ x: 1 }, { x: 1 }, {}); // false
 * ```
 */
const NotObjectCase: EqualsCase = equalsCreateCase(
    /* guard: */ (a: unknown, b: unknown) =>
        typeof a !== 'object' || typeof b !== 'object',

    /* compare: */ () => false,

    /* descriptor: */ {
        name: 'NotObject',
    },
);

export default NotObjectCase;
