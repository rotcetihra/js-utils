import { type EqualsCase, equals, equalsCreateCase } from '@/index.mjs';

/**
 * Кейс для {@link equals}, проверяющий прототипы объектов.
 *
 * Guard срабатывает, если у двух сравниваемых объектов разные прототипы,
 * определяемые через {@link Object.getPrototypeOf}.
 *
 * В таком случае компаратор всегда возвращает `false`, так как объекты
 * с разными прототипами считаются неэквивалентными, даже если их поля
 * выглядят одинаково.
 *
 * Этот кейс должен выполняться до любых «глубоких» проверок свойств,
 * чтобы быстро отсекать объекты разных классов.
 *
 * @example
 * ```ts
 * class A { x = 1; }
 * class B { x = 1; }
 *
 * const a = new A();
 * const b = new B();
 *
 * // Разные прототипы → guard вернёт true → сравнение = false
 * EqualsPrototypeCase[0](a, b, {}); // true
 * EqualsPrototypeCase[1](a, b, {}); // false
 *
 * // Объекты с одинаковым прототипом (например, два {}):
 * const o1 = {};
 * const o2 = {};
 *
 * EqualsPrototypeCase[0](o1, o2, {}); // false — guard не сработал
 * ```
 */
const PrototypeCase: EqualsCase = equalsCreateCase(
    /* guard: */ (a: unknown, b: unknown) =>
        !Object.is(Object.getPrototypeOf(a), Object.getPrototypeOf(b)),

    /* compare: */ () => false,

    /* descriptor: */ {
        name: 'Prototype',
    },
);

export default PrototypeCase;
