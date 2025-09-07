/**
 * Проверяет, является ли переданное значение **объектом-боксом** для булева,
 * созданным с помощью конструктора `new Boolean(...)`.
 *
 * В JavaScript существуют два разных вида булевых значений:
 *
 * - **Примитивные**: `true` и `false`.
 * - **Боксированные (объектные)**: `new Boolean(true)` и `new Boolean(false)`.
 *
 * В большинстве случаев использовать боксированные булевы не рекомендуется,
 * однако для полноты сравнения или при работе с «экзотическим» кодом иногда
 * нужно уметь различать эти формы.
 *
 * @param value Значение любого типа.
 * @returns `true`, если `value` является экземпляром `Boolean` (объект-бокс),
 *          иначе `false`.
 *
 * @example
 * ```ts
 * isBoxedBoolean(true);                // false — примитив
 * isBoxedBoolean(false);               // false — примитив
 * isBoxedBoolean(new Boolean(true));   // true  — объект-бокс
 * isBoxedBoolean(new Boolean(false));  // true  — объект-бокс
 * ```
 */
function isBoxedBoolean(value: unknown): value is Boolean {
    return value instanceof Boolean;
}

export default isBoxedBoolean;
