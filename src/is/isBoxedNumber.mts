/**
 * Проверяет, является ли переданное значение **объектом-боксом** для числа,
 * созданным с помощью конструктора `new Number(...)`.
 *
 * В JavaScript есть два вида чисел:
 *
 * - **Примитивные**: `42`, `3.14`, `NaN`, `Infinity` и т.д.
 * - **Боксированные (объектные)**: `new Number(42)`, `new Number(NaN)`.
 *
 * Боксированные числа ведут себя как объекты и обычно используются крайне редко.
 * В повседневном коде почти всегда применяются примитивные значения.
 * Эта функция может быть полезна при глубоких проверках равенства или при
 * взаимодействии с нестандартным кодом.
 *
 * @param value Значение любого типа.
 * @returns `true`, если `value` является экземпляром `Number` (объект-бокс),
 *          иначе `false`.
 *
 * @example
 * ```ts
 * isBoxedNumber(42);             // false — примитив
 * isBoxedNumber(NaN);            // false — примитив
 * isBoxedNumber(new Number(42)); // true  — объект-бокс
 * isBoxedNumber(new Number(NaN));// true  — объект-бокс
 * ```
 */
function isBoxedNumber(value: unknown): value is Number {
    return value instanceof Number;
}

export default isBoxedNumber;
