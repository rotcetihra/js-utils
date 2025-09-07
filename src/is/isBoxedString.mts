/**
 * Проверяет, является ли переданное значение **объектом-боксом** для строки,
 * созданным с помощью конструктора `new String(...)`.
 *
 * В JavaScript строки бывают двух видов:
 *
 * - **Примитивные**: `"hello"`, `""`, `'abc'` и т.д.
 * - **Боксированные (объектные)**: `new String("hello")`.
 *
 * Боксированные строки ведут себя как объекты и используются редко.
 * В основном они встречаются в «старом» или необычном коде.
 * Эта функция позволяет явно отличить такие значения от обычных строк-примитивов.
 *
 * @param value Значение любого типа.
 * @returns `true`, если `value` является экземпляром `String` (объект-бокс),
 *          иначе `false`.
 *
 * @example
 * ```ts
 * isBoxedString("hello");            // false — примитив
 * isBoxedString("");                 // false — примитив
 * isBoxedString(new String("hi"));   // true  — объект-бокс
 * isBoxedString(new String(""));     // true  — объект-бокс
 * ```
 */
function isBoxedString(value: unknown): value is String {
    return value instanceof String;
}

export default isBoxedString;
