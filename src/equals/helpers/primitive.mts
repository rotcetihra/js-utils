/**
 * Сравнивает два значения как примитивы с учётом выбранного режима —
 * строгого или «слабого» сравнения.
 *
 * По умолчанию используется строгая проверка через `Object.is`, которая:
 *
 * - отличает `+0` и `-0` (`Object.is(+0, -0) === false`),
 * - считает `NaN` равным самому себе (`Object.is(NaN, NaN) === true`),
 * - для всех остальных случаев работает как строгое равенство по ссылке/значению.
 *
 * Если включён режим `loose` (`loose: true`), используется оператор `==`:
 *
 * - `1 == '1'` → `true`
 * - `true == 1` → `true`
 * - `null == undefined` → `true`
 * - но `NaN == NaN` остаётся `false`
 *
 * Эта функция предназначена для проверки равенства примитивов и
 * боксированных значений на базовом уровне. Для структурных объектов
 * (массивов, карт, сетов) применяются отдельные алгоритмы сравнения.
 *
 * @param a Первое сравниваемое значение.
 * @param b Второе сравниваемое значение.
 * @param loose Включает «слабое» сравнение через `==` (по умолчанию `false`).
 * @returns `true`, если значения равны в выбранном режиме, иначе `false`.
 *
 * @example
 * ```ts
 * equalsPrimitive(1, 1);            // true
 * equalsPrimitive(NaN, NaN);        // true
 * equalsPrimitive(+0, -0);          // false
 *
 * equalsPrimitive(1, '1');          // false
 * equalsPrimitive(1, '1', true);    // true
 *
 * equalsPrimitive(null, undefined);       // false
 * equalsPrimitive(null, undefined, true); // true
 * ```
 */
function primitive(a: unknown, b: unknown, loose: boolean = false): boolean {
    return loose ? a == b : Object.is(a, b);
}

export default primitive;
