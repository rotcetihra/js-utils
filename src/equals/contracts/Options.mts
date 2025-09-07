import { equals } from '@/index.mjs';

/**
 * Набор опций для функции {@link equals}, определяющий,
 * как именно сравнивать значения.
 *
 * Каждое свойство управляет отдельным аспектом поведения:
 *
 * - {@link Options.loose | loose} — использовать нестрогое равенство для примитивов.
 * - {@link Options.ownKeys | ownKeys} — учитывать все собственные ключи (включая символы).
 * - {@link Options.compareDescriptors | compareDescriptors} — сравнивать дескрипторы свойств объектов.
 * - {@link Options.deep | deep} — включить глубокое сравнение вложенных структур.
 * - {@link Options.depth | depth} — ограничить максимальную глубину рекурсии.
 */
interface Options {
    /**
     * Использовать нестрогое равенство (`==`) вместо строгого `Object.is`
     * для примитивных значений.
     *
     * @default false
     *
     * @example
     * equals(1, '1', { loose: true }); // true
     * equals(1, '1', { loose: false }); // false
     */
    loose?: boolean;

    /**
     * Сравнивать **все собственные ключи объекта**:
     * строковые, символьные, а также неперечислимые.
     *
     * По умолчанию учитываются только перечислимые строковые ключи
     * (результат `Object.keys`).
     *
     * @default false
     *
     * @example
     * const a = {};
     * const b = {};
     * Object.defineProperty(a, 'x', { value: 1, enumerable: false });
     * Object.defineProperty(b, 'x', { value: 1, enumerable: false });
     *
     * equals(a, b); // true
     * equals(a, b, { ownKeys: true }); // true, с учётом неперечислимого свойства
     */
    ownKeys?: boolean;

    /**
     * Сравнивать дескрипторы свойств объектов.
     *
     * Включает проверку:
     * - `enumerable`
     * - `configurable`
     * - `writable`
     * - `get` и `set` (функции доступа)
     *
     * @default false
     *
     * @example
     * const a = {};
     * const b = {};
     * Object.defineProperty(a, 'x', { value: 1, writable: false });
     * Object.defineProperty(b, 'x', { value: 1, writable: true });
     *
     * equals(a, b); // true
     * equals(a, b, { compareDescriptors: true }); // false
     */
    compareDescriptors?: boolean;

    /**
     * Включить глубокое сравнение вложенных структур.
     * Если выключено — сравнение выполняется только на верхнем уровне.
     *
     * @default false
     *
     * @example
     * equals({ x: { y: 1 } }, { x: { y: 1 } }); // false
     * equals({ x: { y: 1 } }, { x: { y: 1 } }, { deep: true }); // true
     */
    deep?: boolean;

    /**
     * Максимальная глубина рекурсии при глубоком сравнении.
     * Если глубина достигнута, вложенные значения сравниваются
     * только по `Object.is` или {@link loose}.
     *
     * @default 10
     *
     * @example
     * const a: any = {}; const b: any = {};
     * a.self = a; b.self = b;
     *
     * equals(a, b, { deep: true, depth: 5 }); // true, не зацикливается
     */
    depth?: number;
}

export type { Options };
